#!/usr/bin/env python3
"""
Scheduler Service for Recurring Reports
Handles scheduling, execution, and management of recurring report jobs
"""

import os
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Callable
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.jobstores.memory import MemoryJobStore
from apscheduler.executors.pool import ThreadPoolExecutor
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
from croniter import croniter
import uuid

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SchedulerService:
    """Service for managing recurring report jobs"""
    
    def __init__(self, cache_dir: str = 'data_cache'):
        self.cache_dir = cache_dir
        self.scheduled_reports_file = os.path.join(cache_dir, 'scheduled_reports.json')
        self.report_jobs_file = os.path.join(cache_dir, 'report_jobs.json')
        self.report_history_file = os.path.join(cache_dir, 'report_history.json')
        
        # Ensure cache directory exists
        os.makedirs(cache_dir, exist_ok=True)
        
        # Initialize scheduler
        jobstores = {
            'default': MemoryJobStore()
        }
        executors = {
            'default': ThreadPoolExecutor(20)
        }
        job_defaults = {
            'coalesce': False,
            'max_instances': 3
        }
        
        self.scheduler = BackgroundScheduler(
            jobstores=jobstores,
            executors=executors,
            job_defaults=job_defaults,
            timezone='UTC'
        )
        
        # Initialize data storage
        self._initialize_storage()
        
        # Start scheduler
        self.scheduler.start()
        logger.info("Scheduler service initialized and started")
        
        # Restore existing jobs
        self._restore_jobs()
    
    def _initialize_storage(self):
        """Initialize JSON storage files if they don't exist"""
        default_files = {
            self.scheduled_reports_file: [],
            self.report_jobs_file: {},
            self.report_history_file: []
        }
        
        for file_path, default_content in default_files.items():
            if not os.path.exists(file_path):
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(default_content, f, indent=2)
    
    def _load_json(self, file_path: str) -> Any:
        """Load data from JSON file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading {file_path}: {e}")
            return [] if 'history' in file_path or 'reports' in file_path else {}
    
    def _save_json(self, file_path: str, data: Any):
        """Save data to JSON file"""
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, default=str)
        except Exception as e:
            logger.error(f"Error saving to {file_path}: {e}")
    
    def create_report(self, config: Dict[str, Any]) -> str:
        """Create a new recurring report
        
        Args:
            config: Report configuration dictionary containing:
                - name: Report name
                - description: Report description  
                - query_config: Query parameters
                - schedule: Schedule configuration
                - output_format: Output format (csv, json, html)
                - delivery_method: How to deliver the report
                - enabled: Whether the report is active
        
        Returns:
            str: Report ID
        """
        report_id = str(uuid.uuid4())
        
        # Validate required fields
        required_fields = ['name', 'query_config', 'schedule']
        for field in required_fields:
            if field not in config:
                raise ValueError(f"Missing required field: {field}")
        
        # Create report configuration
        report_config = {
            'id': report_id,
            'name': config['name'],
            'description': config.get('description', ''),
            'query_config': config['query_config'],
            'schedule': config['schedule'],
            'output_format': config.get('output_format', 'csv'),
            'delivery_method': config.get('delivery_method', 'file'),
            'enabled': config.get('enabled', True),
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat(),
            'next_run': None,
            'last_run': None,
            'run_count': 0
        }
        
        # Save to storage
        reports = self._load_json(self.scheduled_reports_file)
        reports.append(report_config)
        self._save_json(self.scheduled_reports_file, reports)
        
        # Schedule the job if enabled
        if report_config['enabled']:
            self._schedule_job(report_config)
        
        logger.info(f"Created report: {report_config['name']} (ID: {report_id})")
        return report_id
    
    def update_report(self, report_id: str, updates: Dict[str, Any]) -> bool:
        """Update an existing report configuration
        
        Args:
            report_id: Report ID to update
            updates: Dictionary of fields to update
            
        Returns:
            bool: Success status
        """
        reports = self._load_json(self.scheduled_reports_file)
        
        for i, report in enumerate(reports):
            if report['id'] == report_id:
                # Update fields
                reports[i].update(updates)
                reports[i]['updated_at'] = datetime.now().isoformat()
                
                # Save changes
                self._save_json(self.scheduled_reports_file, reports)
                
                # Reschedule job if schedule or enabled status changed
                if 'schedule' in updates or 'enabled' in updates:
                    self._unschedule_job(report_id)
                    if reports[i]['enabled']:
                        self._schedule_job(reports[i])
                
                logger.info(f"Updated report: {report_id}")
                return True
        
        logger.warning(f"Report not found for update: {report_id}")
        return False
    
    def delete_report(self, report_id: str) -> bool:
        """Delete a report and its scheduled job
        
        Args:
            report_id: Report ID to delete
            
        Returns:
            bool: Success status
        """
        reports = self._load_json(self.scheduled_reports_file)
        
        # Find and remove report
        for i, report in enumerate(reports):
            if report['id'] == report_id:
                # Remove from scheduler
                self._unschedule_job(report_id)
                
                # Remove from storage
                reports.pop(i)
                self._save_json(self.scheduled_reports_file, reports)
                
                logger.info(f"Deleted report: {report_id}")
                return True
        
        logger.warning(f"Report not found for deletion: {report_id}")
        return False
    
    def get_report(self, report_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific report configuration
        
        Args:
            report_id: Report ID
            
        Returns:
            Report configuration or None if not found
        """
        reports = self._load_json(self.scheduled_reports_file)
        
        for report in reports:
            if report['id'] == report_id:
                return report
        
        return None
    
    def list_reports(self) -> List[Dict[str, Any]]:
        """Get all report configurations
        
        Returns:
            List of report configurations
        """
        return self._load_json(self.scheduled_reports_file)
    
    def run_report_now(self, report_id: str) -> bool:
        """Manually trigger a report execution
        
        Args:
            report_id: Report ID to execute
            
        Returns:
            bool: Success status
        """
        report_config = self.get_report(report_id)
        if not report_config:
            logger.error(f"Report not found: {report_id}")
            return False
        
        try:
            # Execute the report directly
            self._execute_report(report_config)
            logger.info(f"Manual execution triggered for report: {report_id}")
            return True
        except Exception as e:
            logger.error(f"Failed to execute report {report_id}: {e}")
            return False
    
    def get_report_history(self, report_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        """Get execution history for a specific report
        
        Args:
            report_id: Report ID
            limit: Maximum number of entries to return
            
        Returns:
            List of execution history entries
        """
        history = self._load_json(self.report_history_file)
        
        # Filter by report_id and limit
        report_history = [entry for entry in history if entry.get('report_id') == report_id]
        return sorted(report_history, key=lambda x: x.get('timestamp', ''), reverse=True)[:limit]
    
    def get_all_history(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Get all execution history
        
        Args:
            limit: Maximum number of entries to return
            
        Returns:
            List of execution history entries
        """
        history = self._load_json(self.report_history_file)
        return sorted(history, key=lambda x: x.get('timestamp', ''), reverse=True)[:limit]
    
    def _schedule_job(self, report_config: Dict[str, Any]):
        """Schedule a job in APScheduler
        
        Args:
            report_config: Report configuration
        """
        report_id = report_config['id']
        schedule_config = report_config['schedule']
        
        try:
            # Create trigger based on schedule type
            trigger = self._create_trigger(schedule_config)
            
            # Schedule the job
            self.scheduler.add_job(
                func=self._execute_report,
                trigger=trigger,
                args=[report_config],
                id=report_id,
                name=f"Report: {report_config['name']}",
                replace_existing=True
            )
            
            # Update next run time
            job = self.scheduler.get_job(report_id)
            if job and job.next_run_time:
                reports = self._load_json(self.scheduled_reports_file)
                for report in reports:
                    if report['id'] == report_id:
                        report['next_run'] = job.next_run_time.isoformat()
                        break
                self._save_json(self.scheduled_reports_file, reports)
            
            logger.info(f"Scheduled job for report: {report_id}")
            
        except Exception as e:
            logger.error(f"Failed to schedule job for report {report_id}: {e}")
            raise
    
    def _unschedule_job(self, report_id: str):
        """Remove a job from APScheduler
        
        Args:
            report_id: Report ID
        """
        try:
            self.scheduler.remove_job(report_id)
            logger.info(f"Unscheduled job for report: {report_id}")
        except Exception as e:
            logger.debug(f"Job not found for removal: {report_id} - {e}")
    
    def _create_trigger(self, schedule_config: Dict[str, Any]):
        """Create APScheduler trigger from schedule configuration
        
        Args:
            schedule_config: Schedule configuration
            
        Returns:
            APScheduler trigger object
        """
        schedule_type = schedule_config.get('type', 'interval')
        
        if schedule_type == 'interval':
            # Interval-based scheduling (every X minutes/hours/days)
            interval_type = schedule_config.get('interval_type', 'hours')
            interval_value = schedule_config.get('interval_value', 24)
            
            kwargs = {interval_type: interval_value}
            
            # Add start date if specified
            if 'start_date' in schedule_config:
                kwargs['start_date'] = datetime.fromisoformat(schedule_config['start_date'])
            
            return IntervalTrigger(**kwargs)
        
        elif schedule_type == 'cron':
            # Cron-based scheduling
            cron_expression = schedule_config.get('cron_expression')
            if cron_expression:
                # Validate cron expression
                if not croniter.is_valid(cron_expression):
                    raise ValueError(f"Invalid cron expression: {cron_expression}")
                
                # Parse cron expression
                parts = cron_expression.split()
                if len(parts) == 5:
                    minute, hour, day, month, day_of_week = parts
                    return CronTrigger(
                        minute=minute,
                        hour=hour,
                        day=day,
                        month=month,
                        day_of_week=day_of_week
                    )
            
            # Manual cron configuration
            return CronTrigger(
                minute=schedule_config.get('minute', '0'),
                hour=schedule_config.get('hour', '9'),
                day=schedule_config.get('day', '*'),
                month=schedule_config.get('month', '*'),
                day_of_week=schedule_config.get('day_of_week', '*')
            )
        
        else:
            raise ValueError(f"Unsupported schedule type: {schedule_type}")
    
    def _execute_report(self, report_config: Dict[str, Any]):
        """Execute a report and handle the results
        
        Args:
            report_config: Report configuration
        """
        report_id = report_config['id']
        start_time = datetime.now()
        
        # Create execution entry
        execution_entry = {
            'id': str(uuid.uuid4()),
            'report_id': report_id,
            'report_name': report_config['name'],
            'timestamp': start_time.isoformat(),
            'status': 'running',
            'duration': None,
            'records_generated': 0,
            'output_files': [],
            'error_message': None
        }
        
        # Add to history
        history = self._load_json(self.report_history_file)
        history.append(execution_entry)
        self._save_json(self.report_history_file, history)
        
        try:
            logger.info(f"Executing report: {report_config['name']} (ID: {report_id})")
            
            # Import report generator here to avoid circular imports
            from report_generator import ReportGenerator
            
            # Create report generator instance
            generator = ReportGenerator()
            
            # Generate the report
            result = generator.generate_report(report_config)
            
            # Calculate execution time
            end_time = datetime.now()
            duration = (end_time - start_time).total_seconds()
            
            # Update execution entry
            execution_entry.update({
                'status': 'completed',
                'duration': duration,
                'records_generated': result.get('records_count', 0),
                'output_files': result.get('output_files', []),
                'completed_at': end_time.isoformat()
            })
            
            # Update report statistics
            self._update_report_stats(report_id, start_time)
            
            logger.info(f"Report execution completed: {report_id} ({duration:.2f}s)")
            
        except Exception as e:
            # Handle execution error
            end_time = datetime.now()
            duration = (end_time - start_time).total_seconds()
            
            execution_entry.update({
                'status': 'failed',
                'duration': duration,
                'error_message': str(e),
                'completed_at': end_time.isoformat()
            })
            
            logger.error(f"Report execution failed: {report_id} - {e}")
        
        finally:
            # Update history with final status
            history = self._load_json(self.report_history_file)
            for i, entry in enumerate(history):
                if entry['id'] == execution_entry['id']:
                    history[i] = execution_entry
                    break
            self._save_json(self.report_history_file, history)
    
    def _update_report_stats(self, report_id: str, execution_time: datetime):
        """Update report statistics after execution
        
        Args:
            report_id: Report ID
            execution_time: When the report was executed
        """
        reports = self._load_json(self.scheduled_reports_file)
        
        for report in reports:
            if report['id'] == report_id:
                report['last_run'] = execution_time.isoformat()
                report['run_count'] = report.get('run_count', 0) + 1
                
                # Update next run time
                job = self.scheduler.get_job(report_id)
                if job and job.next_run_time:
                    report['next_run'] = job.next_run_time.isoformat()
                
                break
        
        self._save_json(self.scheduled_reports_file, reports)
    
    def _restore_jobs(self):
        """Restore scheduled jobs after service restart"""
        reports = self._load_json(self.scheduled_reports_file)
        
        for report in reports:
            if report.get('enabled', True):
                try:
                    self._schedule_job(report)
                    logger.info(f"Restored job: {report['name']}")
                except Exception as e:
                    logger.error(f"Failed to restore job {report['name']}: {e}")
    
    def get_scheduler_status(self) -> Dict[str, Any]:
        """Get scheduler status and statistics
        
        Returns:
            Dictionary with scheduler information
        """
        jobs = self.scheduler.get_jobs()
        reports = self._load_json(self.scheduled_reports_file)
        history = self._load_json(self.report_history_file)
        
        # Calculate statistics
        enabled_reports = len([r for r in reports if r.get('enabled', True)])
        recent_executions = len([h for h in history if 
                               datetime.fromisoformat(h.get('timestamp', '1970-01-01')) > 
                               datetime.now() - timedelta(days=7)])
        
        failed_executions = len([h for h in history if h.get('status') == 'failed'])
        
        return {
            'running': self.scheduler.running,
            'total_jobs': len(jobs),
            'total_reports': len(reports),
            'enabled_reports': enabled_reports,
            'recent_executions_7d': recent_executions,
            'failed_executions': failed_executions,
            'next_jobs': [
                {
                    'id': job.id,
                    'name': job.name,
                    'next_run': job.next_run_time.isoformat() if job.next_run_time else None
                }
                for job in sorted(jobs, key=lambda x: x.next_run_time or datetime.max)[:5]
            ]
        }
    
    def shutdown(self):
        """Shutdown the scheduler service"""
        if self.scheduler.running:
            self.scheduler.shutdown()
            logger.info("Scheduler service shutdown")

# Global scheduler instance
_scheduler_instance = None

def get_scheduler() -> SchedulerService:
    """Get global scheduler instance"""
    global _scheduler_instance
    if _scheduler_instance is None:
        _scheduler_instance = SchedulerService()
    return _scheduler_instance

def shutdown_scheduler():
    """Shutdown global scheduler instance"""
    global _scheduler_instance
    if _scheduler_instance:
        _scheduler_instance.shutdown()
        _scheduler_instance = None