import React, { useState } from 'react';
import { Job, JobCategory, JobDifficulty } from '@/lib/types';
import { useRapperGame } from '@/lib/stores/useRapperGame';
import { DEFAULT_JOBS } from '@/lib/gameData';
import { FaBuilding, FaBriefcase, FaMusic, FaVideo, FaChalkboardTeacher, FaLaptopCode } from 'react-icons/fa';
import { formatMoney } from '@/lib/utils';

const JobsSystem: React.FC = () => {
  const gameState = useRapperGame((state) => state);
  const [selectedCategory, setSelectedCategory] = useState<JobCategory | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<JobDifficulty | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'history'>('available');

  const updateGameState = useRapperGame((state) => state.updateGameState);
  
  // Initialize jobs in game state if not present
  React.useEffect(() => {
    if (!gameState.availableJobs) {
      // When initializing the jobs, check if the player meets the requirements for each job
      const initialJobs = DEFAULT_JOBS.map(job => {
        const requirementsMet = checkJobRequirements(job);
        return { ...job, requirementsMet };
      });
      
      updateGameState({
        availableJobs: initialJobs,
        appliedJobs: [],
        activeJobs: [],
        completedJobs: []
      });
    }
  }, [gameState.availableJobs, updateGameState]);

  // Check if player meets job requirements
  const checkJobRequirements = (job: Job): boolean => {
    // Check if the player already has an active job
    const hasActiveJob = gameState.activeJobs && gameState.activeJobs.length > 0;
    
    // If player already has a job, they can't take another one
    if (hasActiveJob) return false;
    
    if (!job.requirements) return true;
    
    const reputationMet = !job.requirements.reputation || gameState.stats.reputation >= job.requirements.reputation;
    const careerLevelMet = !job.requirements.careerLevel || gameState.stats.careerLevel >= job.requirements.careerLevel;
    
    let skillsMet = true;
    if (job.requirements.skills) {
      const skillNames = Object.keys(job.requirements.skills) as Array<keyof typeof job.requirements.skills>;
      skillsMet = skillNames.every(skillName => {
        // Find the skill in gameState.skills
        if (!gameState.skills) return false;
        const skill = gameState.skills.find(s => s.name === skillName);
        if (!skill) return false;
        
        const requiredLevel = job.requirements!.skills![skillName] as number;
        return skill.level >= requiredLevel;
      });
    }
    
    return reputationMet && careerLevelMet && skillsMet;
  };

  // Apply for a job
  const applyForJob = (jobId: string) => {
    if (!gameState.availableJobs) return;
    
    const jobIndex = gameState.availableJobs.findIndex(job => job.id === jobId);
    if (jobIndex === -1) return;
    
    const job = gameState.availableJobs[jobIndex];
    if (!job.requirementsMet) return;
    
    // Remove from available jobs
    const updatedAvailableJobs = [...gameState.availableJobs];
    updatedAvailableJobs.splice(jobIndex, 1);
    
    // Add to applied jobs with current week as appliedDate
    const appliedJob = {
      ...job,
      appliedDate: gameState.currentWeek,
      status: 'applied' as const
    };
    
    const updatedAppliedJobs = gameState.appliedJobs ? [...gameState.appliedJobs, appliedJob] : [appliedJob];
    
    updateGameState({
      availableJobs: updatedAvailableJobs,
      appliedJobs: updatedAppliedJobs
    });
  };

  // Start working a job (after application is accepted)
  const startJob = (jobId: string) => {
    if (!gameState.appliedJobs) return;
    
    const jobIndex = gameState.appliedJobs.findIndex(job => job.id === jobId);
    if (jobIndex === -1) return;
    
    const job = gameState.appliedJobs[jobIndex];
    
    // Remove from applied jobs
    const updatedAppliedJobs = [...gameState.appliedJobs];
    updatedAppliedJobs.splice(jobIndex, 1);
    
    // Add to active jobs
    const activeJob = {
      jobId: job.id,
      startWeek: gameState.currentWeek,
      endWeek: gameState.currentWeek + job.duration,
      weeklyPay: job.payRate,
      hoursPerWeek: job.hoursPerWeek,
      totalPay: 0,
      weeksWorked: 0,
      performance: 75, // Start with average performance
      warnings: 0
    };
    
    const updatedActiveJobs = gameState.activeJobs ? [...gameState.activeJobs, activeJob] : [activeJob];
    
    // Update job status in available jobs
    const updatedJob = {
      ...job,
      status: 'working' as const,
      acceptedDate: gameState.currentWeek
    };
    
    updateGameState({
      appliedJobs: updatedAppliedJobs,
      activeJobs: updatedActiveJobs,
      availableJobs: gameState.availableJobs ? 
        [...gameState.availableJobs.filter(j => j.id !== job.id), updatedJob] : 
        [updatedJob]
    });
  };

  // Quit a job
  const quitJob = (jobId: string) => {
    if (!gameState.activeJobs) return;
    
    const jobIndex = gameState.activeJobs.findIndex(job => job.jobId === jobId);
    if (jobIndex === -1) return;
    
    // Remove from active jobs
    const updatedActiveJobs = [...gameState.activeJobs];
    updatedActiveJobs.splice(jobIndex, 1);
    
    // Update job status in available jobs
    const availableJobIndex = gameState.availableJobs?.findIndex(job => job.id === jobId);
    if (availableJobIndex === undefined || availableJobIndex === -1) return;
    
    const updatedAvailableJobs = [...(gameState.availableJobs || [])];
    updatedAvailableJobs[availableJobIndex] = {
      ...updatedAvailableJobs[availableJobIndex],
      status: 'available',
      appliedDate: undefined,
      acceptedDate: undefined,
      endDate: undefined
    };
    
    // Add to job history as failed
    const activeJob = gameState.activeJobs[jobIndex];
    const job = updatedAvailableJobs[availableJobIndex];
    
    const jobHistory = {
      jobId: job.id,
      title: job.title,
      category: job.category,
      startWeek: activeJob.startWeek,
      endWeek: gameState.currentWeek,
      totalPay: activeJob.totalPay,
      completed: false,
      performance: activeJob.performance
    };
    
    const updatedJobHistory = gameState.completedJobs ? 
      [...gameState.completedJobs, jobHistory] : 
      [jobHistory];
    
    updateGameState({
      activeJobs: updatedActiveJobs,
      availableJobs: updatedAvailableJobs,
      completedJobs: updatedJobHistory
    });
  };

  // Filter jobs based on selected category and difficulty
  const getFilteredJobs = (): Job[] => {
    if (!gameState.availableJobs) return [];
    
    return gameState.availableJobs.filter(job => {
      const categoryMatch = selectedCategory === 'all' || job.category === selectedCategory;
      const difficultyMatch = selectedDifficulty === 'all' || job.difficulty === selectedDifficulty;
      return categoryMatch && difficultyMatch && job.status === 'available';
    });
  };

  // Get applied jobs
  const getAppliedJobs = (): Job[] => {
    if (!gameState.appliedJobs) return [];
    return gameState.appliedJobs;
  };

  // Get active jobs with details
  const getActiveJobs = () => {
    if (!gameState.activeJobs || !gameState.availableJobs) return [];
    
    return gameState.activeJobs.map(activeJob => {
      const jobDetails = gameState.availableJobs?.find(job => job.id === activeJob.jobId);
      if (!jobDetails) return null;
      
      return {
        ...activeJob,
        details: jobDetails
      };
    }).filter(Boolean);
  };

  // Get completed jobs with details
  const getCompletedJobs = () => {
    if (!gameState.completedJobs) return [];
    return gameState.completedJobs;
  };

  // Get icon for job category
  const getCategoryIcon = (category: JobCategory) => {
    switch (category) {
      case 'studio':
        return <FaMusic className="text-blue-500" />;
      case 'performing':
        return <FaVideo className="text-purple-500" />;
      case 'teaching':
        return <FaChalkboardTeacher className="text-green-500" />;
      case 'media':
        return <FaVideo className="text-red-500" />;
      case 'industry':
        return <FaBuilding className="text-gray-500" />;
      case 'freelance':
        return <FaLaptopCode className="text-yellow-500" />;
      default:
        return <FaBriefcase />;
    }
  };

  // Get color for job difficulty
  const getDifficultyColor = (difficulty: JobDifficulty) => {
    switch (difficulty) {
      case 'entry':
        return 'text-green-500';
      case 'basic':
        return 'text-blue-500';
      case 'intermediate':
        return 'text-yellow-500';
      case 'advanced':
        return 'text-orange-500';
      case 'expert':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  // Format requirements as text
  const formatRequirements = (job: Job): string => {
    const reqs: string[] = [];
    
    if (job.requirements?.reputation) {
      reqs.push(`${job.requirements.reputation} reputation`);
    }
    
    if (job.requirements?.careerLevel) {
      reqs.push(`Career level ${job.requirements.careerLevel}`);
    }
    
    if (job.requirements?.skills) {
      Object.entries(job.requirements.skills).forEach(([skill, level]) => {
        reqs.push(`${skill.charAt(0).toUpperCase() + skill.slice(1)} level ${level}`);
      });
    }
    
    return reqs.join(', ');
  };

  // Format skill gains as text
  const formatSkillGains = (job: Job): string => {
    const gains: string[] = [];
    
    Object.entries(job.skillGains).forEach(([skill, level]) => {
      gains.push(`+${level} ${skill.charAt(0).toUpperCase() + skill.slice(1)}`);
    });
    
    return gains.join(', ');
  };

  // Render loading state if data isn't ready
  if (!gameState.availableJobs) {
    return (
      <div className="p-4 text-center">
        <p>Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        Music Industry Jobs
      </h1>
      
      {/* Tabs for different job views */}
      <div className="flex mb-6 border-b border-gray-700">
        <button 
          className={`px-4 py-2 ${activeTab === 'available' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
          onClick={() => setActiveTab('available')}
        >
          Available Jobs
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'active' ? 'border-b-2 border-green-500 text-green-500' : 'text-gray-400'}`}
          onClick={() => setActiveTab('active')}
        >
          Current Jobs
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'history' ? 'border-b-2 border-purple-500 text-purple-500' : 'text-gray-400'}`}
          onClick={() => setActiveTab('history')}
        >
          Job History
        </button>
      </div>
      
      {activeTab === 'available' && (
        <>
          {gameState.activeJobs && gameState.activeJobs.length > 0 && (
            <div className="mb-6 bg-orange-800 text-white p-4 rounded-lg">
              <div className="font-semibold mb-1">You already have an active job</div>
              <p className="text-sm text-orange-200">You can only work one job at a time. Quit your current job to apply for a new one.</p>
            </div>
          )}
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <div className="relative">
                <select 
                  className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 w-full appearance-none hover:bg-gray-700 transition-colors"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as JobCategory | 'all')}
                >
                  <option value="all" className="py-2 px-4 hover:bg-blue-600">All Categories</option>
                  <option value="studio" className="py-2 px-4 hover:bg-blue-600">Studio</option>
                  <option value="performing" className="py-2 px-4 hover:bg-blue-600">Performing</option>
                  <option value="teaching" className="py-2 px-4 hover:bg-blue-600">Teaching</option>
                  <option value="media" className="py-2 px-4 hover:bg-blue-600">Media</option>
                  <option value="industry" className="py-2 px-4 hover:bg-blue-600">Industry</option>
                  <option value="freelance" className="py-2 px-4 hover:bg-blue-600">Freelance</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Difficulty</label>
              <div className="relative">
                <select 
                  className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 w-full appearance-none hover:bg-gray-700 transition-colors"
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value as JobDifficulty | 'all')}
                >
                  <option value="all" className="py-2 px-4 hover:bg-blue-600">All Difficulties</option>
                  <option value="entry" className="py-2 px-4 hover:bg-blue-600">Entry Level</option>
                  <option value="basic" className="py-2 px-4 hover:bg-blue-600">Basic</option>
                  <option value="intermediate" className="py-2 px-4 hover:bg-blue-600">Intermediate</option>
                  <option value="advanced" className="py-2 px-4 hover:bg-blue-600">Advanced</option>
                  <option value="expert" className="py-2 px-4 hover:bg-blue-600">Expert</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Job listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getFilteredJobs().map(job => (
              <div 
                key={job.id} 
                className={`p-4 rounded-lg ${job.requirementsMet ? 'bg-gray-800' : 'bg-gray-800 opacity-70'} border ${job.requirementsMet ? 'border-gray-700' : 'border-red-700'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getCategoryIcon(job.category)}</span>
                    <h2 className="text-xl font-semibold">{job.title}</h2>
                  </div>
                  <span className={`text-sm font-medium ${getDifficultyColor(job.difficulty)}`}>
                    {job.difficulty.charAt(0).toUpperCase() + job.difficulty.slice(1)}
                  </span>
                </div>
                
                <p className="text-gray-400 mb-3">{job.description}</p>
                
                <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500">Pay:</span>
                    <span className="font-medium ml-2 text-green-400">{formatMoney(job.payRate)}/week</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Duration:</span>
                    <span className="font-medium ml-2">{job.duration} weeks</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Hours:</span>
                    <span className="font-medium ml-2">{job.hoursPerWeek} hrs/week</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Rep Gain:</span>
                    <span className="font-medium ml-2 text-blue-400">+{job.reputationGain}</span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="text-sm text-gray-500 mb-1">Skills Gained:</div>
                  <div className="text-sm font-medium text-blue-400">{formatSkillGains(job)}</div>
                </div>
                
                {!job.requirementsMet && (
                  <div className="mb-3">
                    <div className="text-sm text-red-500 mb-1">Requirements:</div>
                    <div className="text-sm font-medium text-red-400">{formatRequirements(job)}</div>
                  </div>
                )}
                
                <button
                  className={`w-full py-2 rounded-md ${
                    job.requirementsMet
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  }`}
                  onClick={() => job.requirementsMet && applyForJob(job.id)}
                  disabled={!job.requirementsMet}
                >
                  {job.requirementsMet ? 'Apply' : 'Requirements Not Met'}
                </button>
              </div>
            ))}
          </div>
          
          {getFilteredJobs().length === 0 && (
            <div className="text-center text-gray-400 py-8">
              No jobs found matching your filters.
            </div>
          )}
        </>
      )}
      
      {activeTab === 'active' && (
        <>
          <h2 className="text-xl font-semibold mb-4">Applied Jobs</h2>
          {getAppliedJobs().length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {getAppliedJobs().map(job => (
                <div key={job.id} className="p-4 rounded-lg bg-gray-800 border border-yellow-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getCategoryIcon(job.category)}</span>
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                    </div>
                    <span className="text-yellow-500 text-sm font-medium">Applied</span>
                  </div>
                  
                  <p className="text-gray-400 mb-3">{job.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">Applied Week:</span>
                      <span className="font-medium ml-2">Week {job.appliedDate}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Pay:</span>
                      <span className="font-medium ml-2 text-green-400">{formatMoney(job.payRate)}/week</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      className="flex-1 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => startJob(job.id)}
                    >
                      Accept & Start
                    </button>
                    <button
                      className="flex-1 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => applyForJob(job.id)} // This will cancel and put back in available
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-4 mb-8">
              You haven't applied to any jobs yet.
            </div>
          )}
          
          <h2 className="text-xl font-semibold mb-4">Current Jobs</h2>
          {getActiveJobs().length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getActiveJobs().map(job => (
                <div key={job.jobId} className="p-4 rounded-lg bg-gray-800 border border-green-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getCategoryIcon(job.details.category)}</span>
                      <h3 className="text-xl font-semibold">{job.details.title}</h3>
                    </div>
                    <span className="text-green-500 text-sm font-medium">Working</span>
                  </div>
                  
                  <p className="text-gray-400 mb-3">{job.details.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">Started:</span>
                      <span className="font-medium ml-2">Week {job.startWeek}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Ends:</span>
                      <span className="font-medium ml-2">Week {job.endWeek}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Weekly Pay:</span>
                      <span className="font-medium ml-2 text-green-400">{formatMoney(job.weeklyPay)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Total Earned:</span>
                      <span className="font-medium ml-2 text-green-400">{formatMoney(job.totalPay)}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-500">Performance:</span>
                      <span className="text-sm font-medium">
                        {job.performance < 50 ? (
                          <span className="text-red-500">Poor</span>
                        ) : job.performance < 75 ? (
                          <span className="text-yellow-500">Average</span>
                        ) : job.performance < 90 ? (
                          <span className="text-green-500">Good</span>
                        ) : (
                          <span className="text-blue-500">Excellent</span>
                        )}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          job.performance < 50 ? 'bg-red-600' : 
                          job.performance < 75 ? 'bg-yellow-500' : 
                          job.performance < 90 ? 'bg-green-500' :
                          'bg-blue-500'
                        }`}
                        style={{ width: `${job.performance}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="text-sm text-gray-500">Warnings:</span>
                      <span className={`text-sm font-medium ml-2 ${job.warnings > 0 ? 'text-red-500' : 'text-gray-300'}`}>
                        {job.warnings}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Progress:</span>
                      <span className="text-sm font-medium ml-2">
                        {job.weeksWorked} / {job.endWeek - job.startWeek} weeks
                      </span>
                    </div>
                  </div>
                  
                  <button
                    className="w-full py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => quitJob(job.jobId)}
                  >
                    Quit Job
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-4">
              You're not currently working any jobs.
            </div>
          )}
        </>
      )}
      
      {activeTab === 'history' && (
        <>
          <h2 className="text-xl font-semibold mb-4">Job History</h2>
          {getCompletedJobs().length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getCompletedJobs().map((job, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg bg-gray-800 border ${job.completed ? 'border-green-700' : 'border-red-700'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getCategoryIcon(job.category)}</span>
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                    </div>
                    <span className={`text-sm font-medium ${job.completed ? 'text-green-500' : 'text-red-500'}`}>
                      {job.completed ? 'Completed' : 'Failed'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">Started:</span>
                      <span className="font-medium ml-2">Week {job.startWeek}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Ended:</span>
                      <span className="font-medium ml-2">Week {job.endWeek}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Total Earned:</span>
                      <span className="font-medium ml-2 text-green-400">{formatMoney(job.totalPay)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Performance:</span>
                      <span className={`font-medium ml-2 ${
                        job.performance < 50 ? 'text-red-500' : 
                        job.performance < 75 ? 'text-yellow-500' : 
                        job.performance < 90 ? 'text-green-500' :
                        'text-blue-500'
                      }`}>
                        {job.performance}/100
                      </span>
                    </div>
                  </div>
                  
                  {job.reference && (
                    <div className="mt-2 text-sm">
                      <span className="text-gray-500">Reference:</span>
                      <span className="font-medium ml-2 text-blue-400">{job.reference}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-4">
              Your job history is empty.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobsSystem;