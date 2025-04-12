import React, { useState, useEffect } from 'react';
import { useRapperGame } from '../../lib/stores/useRapperGame';
import { useToast } from '@/hooks/use-toast';
import { formatNumber } from '../../lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Calendar, Building2, Users, DollarSign, Music, Award } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { recordLabels, RecordLabel, getLabelsByLevelRequirement, getLabelById } from '../../lib/data/recordLabels';

const CompanyManagement: React.FC = () => {
  const { toast } = useToast();
  const {
    company,
    aiRappers,
    stats,
    currentWeek,
    currentYear,
    createCompany,
    updateCompany,
    hireCompanyEmployee,
    fireCompanyEmployee,
    signArtist,
    dropArtist,
  } = useRapperGame();

  const [companyName, setCompanyName] = useState('');
  const [companyType, setCompanyType] = useState<string>('record_label');
  const [companyDescription, setCompanyDescription] = useState('');
  const [employeeCount, setEmployeeCount] = useState(1);
  const [viewState, setViewState] = useState<'overview' | 'create' | 'manage' | 'artists' | 'calendar' | 'labels'>(
    company ? 'overview' : 'create'
  );
  
  // Calendar state
  const [date, setDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<{date: Date, title: string, type: string}[]>([]);
  
  // Record label state
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(null);
  const [availableLabels, setAvailableLabels] = useState<RecordLabel[]>([]);

  // Cost calculation
  const startupCost = 10000;
  const costPerEmployee = company ? 500 * company.level : 500;
  
  // Use effects
  useEffect(() => {
    // Load available record labels based on character level
    if (company?.type === 'record_label') {
      const labels = getLabelsByLevelRequirement(stats.careerLevel || 1);
      setAvailableLabels(labels);
    }
  }, [company, stats.careerLevel]);

  // Handle selecting a record label
  const handleSelectLabel = (labelId: string) => {
    setSelectedLabelId(labelId);
  };

  // Handle signing with a record label
  const handleSignWithLabel = () => {
    if (!selectedLabelId || !company) return;
    
    const label = getLabelById(selectedLabelId);
    if (!label) return;
    
    // Check if the player has enough reputation
    if (stats.reputation < label.reputation * 0.8) {
      toast({
        title: 'Not Enough Reputation',
        description: `You need at least ${Math.floor(label.reputation * 0.8)} reputation to sign with ${label.name}`,
        variant: 'destructive'
      });
      return;
    }
    
    // Implement signing logic here by updating your game state
    // This would typically update company.partnerLabel or similar property
    toast({
      title: 'Signed with Label',
      description: `You've successfully partnered with ${label.name}!`,
    });
    
    // Apply signing bonus if there is one
    if (label.signupBonus) {
      // Update wealth with the bonus
      // updateWealth(label.signupBonus);
      toast({
        title: 'Signing Bonus',
        description: `You received a $${formatNumber(label.signupBonus)} signing bonus!`,
      });
    }
    
    // Go back to overview
    setViewState('overview');
  };

  // Handle company creation
  const handleCreateCompany = () => {
    if (!companyName) {
      toast({
        title: 'Error',
        description: 'Please enter a company name',
        variant: 'destructive'
      });
      return;
    }

    if (stats.reputation < 25) {
      toast({
        title: 'Error',
        description: 'You need at least 25 reputation to start a company',
        variant: 'destructive'
      });
      return;
    }

    if (stats.wealth < startupCost) {
      toast({
        title: 'Error',
        description: `You need at least $${formatNumber(startupCost)} to start a company`,
        variant: 'destructive'
      });
      return;
    }

    const companyId = createCompany(companyName, companyType, companyDescription);
    
    if (companyId) {
      toast({
        title: 'Success',
        description: `${companyName} has been successfully created!`
      });
      setViewState('overview');
    } else {
      toast({
        title: 'Error',
        description: 'Failed to create company. Please check requirements.',
        variant: 'destructive'
      });
    }
  };

  // Handle hiring employees
  const handleHireEmployees = () => {
    const hireCost = costPerEmployee * employeeCount;
    
    if (stats.wealth < hireCost) {
      toast({
        title: 'Error',
        description: `You need $${formatNumber(hireCost)} to hire ${employeeCount} employees`,
        variant: 'destructive'
      });
      return;
    }
    
    hireCompanyEmployee(employeeCount);
    toast({
      title: 'Success',
      description: `Hired ${employeeCount} new employees`
    });
  };

  // Handle firing employees
  const handleFireEmployees = () => {
    const maxFireable = Math.max(0, (company?.employees || 1) - 1);
    
    if (employeeCount > maxFireable) {
      toast({
        title: 'Error',
        description: `You can't fire more than ${maxFireable} employees`,
        variant: 'destructive'
      });
      return;
    }
    
    if (employeeCount <= 0) {
      toast({
        title: 'Error',
        description: 'Please enter a valid number of employees to fire',
        variant: 'destructive'
      });
      return;
    }
    
    const fireCost = (costPerEmployee / 2) * employeeCount; // Severance cost
    
    if (stats.wealth < fireCost) {
      toast({
        title: 'Error',
        description: `You need $${formatNumber(fireCost)} for severance packages`,
        variant: 'destructive'
      });
      return;
    }
    
    fireCompanyEmployee(employeeCount);
    toast({
      title: 'Success',
      description: `Let go of ${employeeCount} employees`
    });
  };

  // Handle signing an artist
  const handleSignArtist = (artistId: string) => {
    if (company?.type !== 'record_label') {
      toast({
        title: 'Error',
        description: 'Only record labels can sign artists',
        variant: 'destructive'
      });
      return;
    }
    
    const artist = aiRappers.find(a => a.id === artistId);
    if (!artist) return;
    
    const signingCost = artist.popularity * 1000;
    
    if (stats.wealth < signingCost) {
      toast({
        title: 'Error',
        description: `You need $${formatNumber(signingCost)} to sign ${artist.name}`,
        variant: 'destructive'
      });
      return;
    }
    
    const success = signArtist(artistId);
    
    if (success) {
      toast({
        title: 'Success',
        description: `Signed ${artist.name} to your label!`
      });
    } else {
      toast({
        title: 'Error',
        description: `Failed to sign ${artist.name}. Please check requirements.`,
        variant: 'destructive'
      });
    }
  };

  // Handle dropping an artist
  const handleDropArtist = (artistId: string) => {
    if (company?.type !== 'record_label') {
      toast({
        title: 'Error',
        description: 'Only record labels can drop artists',
        variant: 'destructive'
      });
      return;
    }
    
    const artist = aiRappers.find(a => a.id === artistId);
    if (!artist) return;
    
    const terminationFee = artist.popularity * 500;
    
    if (stats.wealth < terminationFee) {
      toast({
        title: 'Error',
        description: `You need $${formatNumber(terminationFee)} for contract termination`,
        variant: 'destructive'
      });
      return;
    }
    
    const success = dropArtist(artistId);
    
    if (success) {
      toast({
        title: 'Success',
        description: `Dropped ${artist.name} from your label`
      });
    } else {
      toast({
        title: 'Error',
        description: `Failed to drop ${artist.name}. Please check requirements.`,
        variant: 'destructive'
      });
    }
  };

  // Get company type display name
  const getCompanyTypeDisplay = (type: string) => {
    switch (type) {
      case 'record_label': return 'Record Label';
      case 'production_company': return 'Production Company';
      case 'clothing_brand': return 'Clothing Brand';
      case 'media_company': return 'Media Company';
      case 'other': return 'Other Business';
      default: return type;
    }
  };

  // Render create company view
  const renderCreateCompany = () => (
    <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">Start Your Own Company</h2>
      <p className="mb-4 text-gray-300">
        Create your own business in the music industry. You need at least 25 reputation and $10,000 to start.
      </p>
      
      <div className="mb-4">
        <label className="block text-gray-300 mb-2">Company Name</label>
        <input 
          type="text" 
          value={companyName} 
          onChange={(e) => setCompanyName(e.target.value)} 
          className="w-full bg-gray-800 text-white p-2 rounded"
          placeholder="Company Name"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-300 mb-2">Company Type</label>
        <select 
          value={companyType} 
          onChange={(e) => setCompanyType(e.target.value)} 
          className="w-full bg-gray-800 text-white p-2 rounded"
        >
          <option value="record_label">Record Label</option>
          <option value="production_company">Production Company</option>
          <option value="clothing_brand">Clothing Brand</option>
          <option value="media_company">Media Company</option>
          <option value="other">Other Business</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-300 mb-2">Description (Optional)</label>
        <textarea 
          value={companyDescription} 
          onChange={(e) => setCompanyDescription(e.target.value)} 
          className="w-full bg-gray-800 text-white p-2 rounded"
          placeholder="Describe your company's mission and vision"
          rows={3}
        />
      </div>
      
      <div className="bg-gray-800 rounded p-4 mb-4">
        <h3 className="font-bold text-white mb-2">Startup Requirements</h3>
        <div className="flex justify-between mb-1">
          <span className="text-gray-300">Reputation:</span>
          <span className={stats.reputation >= 25 ? "text-green-400" : "text-red-400"}>
            {stats.reputation}/25
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Capital:</span>
          <span className={stats.wealth >= startupCost ? "text-green-400" : "text-red-400"}>
            ${formatNumber(stats.wealth)}/${formatNumber(startupCost)}
          </span>
        </div>
      </div>
      
      <button 
        onClick={handleCreateCompany} 
        className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold py-2 px-4 rounded"
        disabled={stats.reputation < 25 || stats.wealth < startupCost}
      >
        Start Company
      </button>
    </div>
  );

  // Render company overview
  const renderCompanyOverview = () => {
    if (!company) return null;
    
    return (
      <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">{company.name}</h2>
          <span className="bg-blue-600 px-3 py-1 rounded-full text-xs font-medium text-white">
            Level {company.level}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800 rounded p-4">
            <h3 className="font-bold text-white mb-2">Company Details</h3>
            <div className="text-gray-300 space-y-1">
              <div className="flex justify-between">
                <span>Type:</span>
                <span>{getCompanyTypeDisplay(company.type)}</span>
              </div>
              <div className="flex justify-between">
                <span>Founded:</span>
                <span>Week {company.foundedWeek}, Year {company.foundedYear}</span>
              </div>
              <div className="flex justify-between">
                <span>Employees:</span>
                <span>{company.employees}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded p-4">
            <h3 className="font-bold text-white mb-2">Financial Overview</h3>
            <div className="text-gray-300 space-y-1">
              <div className="flex justify-between">
                <span>Value:</span>
                <span>${formatNumber(company.value)}</span>
              </div>
              <div className="flex justify-between">
                <span>Revenue:</span>
                <span>${formatNumber(company.revenue)}</span>
              </div>
              <div className="flex justify-between">
                <span>Your Cash:</span>
                <span>${formatNumber(stats.wealth)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {company.type === 'record_label' && (
          <div className="bg-gray-800 rounded p-4 mb-6">
            <h3 className="font-bold text-white mb-2">Signed Artists</h3>
            {company.artists && company.artists.length > 0 ? (
              <div className="text-gray-300">
                {company.artists.map(artistId => {
                  const artist = aiRappers.find(a => a.id === artistId);
                  return artist ? (
                    <div key={artistId} className="flex justify-between items-center py-2 border-b border-gray-700">
                      <span>{artist.name}</span>
                      <span className="text-xs bg-blue-900 px-2 py-1 rounded">
                        Popularity: {artist.popularity}
                      </span>
                    </div>
                  ) : null;
                })}
              </div>
            ) : (
              <p className="text-gray-400 italic">No artists signed yet</p>
            )}
          </div>
        )}
        
        <div className="flex space-x-3 mb-4">
          <button 
            onClick={() => setViewState('manage')} 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Manage Employees
          </button>
          
          {company.type === 'record_label' && (
            <button 
              onClick={() => setViewState('artists')} 
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
              Manage Artists
            </button>
          )}
        </div>
        
        <div className="flex space-x-3 mb-4">
          <button 
            onClick={() => setViewState('calendar')} 
            className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Company Calendar
          </button>
          
          {company.type === 'record_label' && (
            <button 
              onClick={() => setViewState('labels')} 
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Partner with Label
            </button>
          )}
        </div>
      </div>
    );
  };

  // Render employee management view
  const renderManageEmployees = () => {
    if (!company) return null;
    
    return (
      <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Employee Management</h2>
          <button 
            onClick={() => setViewState('overview')} 
            className="text-blue-400 hover:text-blue-300"
          >
            Back to Overview
          </button>
        </div>
        
        <div className="bg-gray-800 rounded p-4 mb-6">
          <h3 className="font-bold text-white mb-2">Current Workforce</h3>
          <p className="text-gray-300">You currently employ <span className="font-bold">{company.employees}</span> people in your company.</p>
          <p className="text-gray-400 mt-2 text-sm">Each employee costs ${formatNumber(costPerEmployee)} per week in salary.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800 rounded p-4">
            <h3 className="font-bold text-white mb-2">Hire Employees</h3>
            <div className="mb-3">
              <label className="block text-gray-300 mb-1 text-sm">Number to Hire</label>
              <input 
                type="number" 
                min="1"
                value={employeeCount} 
                onChange={(e) => setEmployeeCount(parseInt(e.target.value) || 1)} 
                className="w-full bg-gray-700 text-white p-2 rounded"
              />
            </div>
            <div className="text-gray-300 mb-3">
              <div className="flex justify-between">
                <span>Cost per employee:</span>
                <span>${formatNumber(costPerEmployee)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total cost:</span>
                <span>${formatNumber(costPerEmployee * employeeCount)}</span>
              </div>
            </div>
            <button 
              onClick={handleHireEmployees} 
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              disabled={stats.wealth < costPerEmployee * employeeCount}
            >
              Hire Employees
            </button>
          </div>
          
          <div className="bg-gray-800 rounded p-4">
            <h3 className="font-bold text-white mb-2">Let Go Employees</h3>
            <div className="mb-3">
              <label className="block text-gray-300 mb-1 text-sm">Number to Fire</label>
              <input 
                type="number" 
                min="1"
                max={Math.max(0, company.employees - 1)}
                value={employeeCount} 
                onChange={(e) => setEmployeeCount(parseInt(e.target.value) || 1)} 
                className="w-full bg-gray-700 text-white p-2 rounded"
              />
            </div>
            <div className="text-gray-300 mb-3">
              <div className="flex justify-between">
                <span>Severance per employee:</span>
                <span>${formatNumber(costPerEmployee / 2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total severance:</span>
                <span>${formatNumber((costPerEmployee / 2) * employeeCount)}</span>
              </div>
            </div>
            <button 
              onClick={handleFireEmployees} 
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              disabled={company.employees <= 1 || employeeCount > company.employees - 1 || stats.wealth < (costPerEmployee / 2) * employeeCount}
            >
              Let Go Employees
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded p-4 mb-6">
          <h3 className="font-bold text-white mb-2">Benefits of Employees</h3>
          <ul className="text-gray-300 list-disc pl-5 space-y-1">
            <li>Increase company value and reputation</li>
            <li>Handle more signed artists (for record labels)</li>
            <li>More efficient production (for production companies)</li>
            <li>Better merchandise sales (for clothing brands)</li>
            <li>More content creation (for media companies)</li>
          </ul>
        </div>
      </div>
    );
  };

  // Render artist management view
  const renderManageArtists = () => {
    if (!company || company.type !== 'record_label') return null;
    
    // Get signed artists
    const signedArtistIds = company.artists || [];
    const signedArtists = aiRappers.filter(a => signedArtistIds.includes(a.id));
    
    // Get unsigned artists
    const unsignedArtists = aiRappers.filter(a => !signedArtistIds.includes(a.id));
    
    return (
      <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Artist Management</h2>
          <button 
            onClick={() => setViewState('overview')} 
            className="text-blue-400 hover:text-blue-300"
          >
            Back to Overview
          </button>
        </div>
        
        <div className="mb-6">
          <h3 className="font-bold text-white text-xl mb-3">Signed Artists</h3>
          {signedArtists.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {signedArtists.map(artist => (
                <div key={artist.id} className="bg-gray-800 rounded p-3 flex justify-between items-center">
                  <div>
                    <div className="text-white font-medium">{artist.name}</div>
                    <div className="text-gray-400 text-sm">{artist.style} • Popularity: {artist.popularity}</div>
                  </div>
                  <button 
                    onClick={() => handleDropArtist(artist.id)} 
                    className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
                  >
                    Drop Artist
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 rounded p-4 text-gray-400 italic">
              You haven't signed any artists yet
            </div>
          )}
        </div>
        
        <div>
          <h3 className="font-bold text-white text-xl mb-3">Available Artists</h3>
          {unsignedArtists.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {unsignedArtists.map(artist => {
                const signingCost = artist.popularity * 1000;
                
                return (
                  <div key={artist.id} className="bg-gray-800 rounded p-3 flex justify-between items-center">
                    <div>
                      <div className="text-white font-medium">{artist.name}</div>
                      <div className="text-gray-400 text-sm">
                        {artist.style} • Popularity: {artist.popularity} • Cost: ${formatNumber(signingCost)}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleSignArtist(artist.id)} 
                      className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
                      disabled={stats.wealth < signingCost}
                    >
                      Sign Artist
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-gray-800 rounded p-4 text-gray-400 italic">
              No artists available to sign right now
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render calendar view
  const renderCalendar = () => {
    if (!company) return null;
    
    // Create some example events based on company founding date
    useEffect(() => {
      if (company && events.length === 0) {
        // Add founding event
        const foundingDate = new Date();
        foundingDate.setDate(foundingDate.getDate() - (company.foundedWeek * 7));
        
        // Add some sample events
        const newEvents = [
          {
            date: foundingDate,
            title: `${company.name} Founded`,
            type: 'milestone'
          },
          {
            date: new Date(), // Today
            title: 'Weekly Financial Review',
            type: 'meeting'
          },
          {
            date: new Date(new Date().setDate(new Date().getDate() + 7)), // Next week
            title: 'Quarterly Planning',
            type: 'meeting'
          }
        ];
        setEvents(newEvents);
      }
    }, [company]);

    const getFormattedDate = () => {
      return format(date, 'dd/MM/yyyy');
    };
    
    // Get events for the selected date
    const selectedDateEvents = events.filter(event => {
      return new Date(event.date).toDateString() === new Date(date).toDateString();
    });

    return (
      <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Company Calendar</h2>
          <button 
            onClick={() => setViewState('overview')} 
            className="text-blue-400 hover:text-blue-300"
          >
            Back to Overview
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded p-4">
            <div className="text-white text-center mb-4">
              <h3 className="font-semibold text-lg">Current Date: Week {currentWeek}, Year {currentYear}</h3>
              <p className="text-gray-400 text-sm">Selected: {getFormattedDate()}</p>
            </div>
            
            <div className="bg-gray-700 rounded overflow-hidden">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                className="text-white"
              />
            </div>
            
            <div className="mt-4 flex justify-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setDate(subMonths(date, 1))}
              >
                Previous Month
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setDate(new Date())}
              >
                Today
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setDate(addMonths(date, 1))}
              >
                Next Month
              </Button>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded p-4">
            <h3 className="font-bold text-white mb-3">Events for {format(date, 'dd/MM/yyyy')}</h3>
            
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedDateEvents.map((event, index) => (
                  <div key={index} className="bg-gray-700 rounded p-3 border-l-4 border-blue-500">
                    <div className="font-medium text-white">{event.title}</div>
                    <div className="text-xs text-gray-400">
                      {event.type === 'milestone' ? 'Company Milestone' : 
                       event.type === 'meeting' ? 'Business Meeting' : 'Event'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-700 rounded p-4 text-gray-400 italic">
                No events scheduled for this date
              </div>
            )}
            
            <div className="mt-4">
              <h4 className="font-semibold text-white mb-2">All Company Events</h4>
              <div className="max-h-60 overflow-y-auto pr-2 space-y-2">
                {events.map((event, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between bg-gray-700 p-2 rounded text-sm hover:bg-gray-600 cursor-pointer"
                    onClick={() => setDate(new Date(event.date))}
                  >
                    <span className="text-white">{event.title}</span>
                    <span className="text-gray-400">{format(new Date(event.date), 'dd/MM/yyyy')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render labels view
  const renderLabelsView = () => {
    if (!company || company.type !== 'record_label') return null;
    
    return (
      <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Partner with a Record Label</h2>
          <button 
            onClick={() => setViewState('overview')} 
            className="text-blue-400 hover:text-blue-300"
          >
            Back to Overview
          </button>
        </div>
        
        <p className="text-gray-300 mb-6">
          Partnering with a major label can boost your distribution and marketing power. 
          Each label offers different benefits and contract terms.
        </p>
        
        <Tabs defaultValue="available">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="available">Available Labels</TabsTrigger>
            <TabsTrigger value="all">All Labels</TabsTrigger>
          </TabsList>
          
          <TabsContent value="available">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableLabels.length > 0 ? (
                availableLabels.map(label => (
                  <Card 
                    key={label.id} 
                    className={`bg-gray-800 border-0 transition-all ${selectedLabelId === label.id ? 'ring-2 ring-purple-500' : 'hover:bg-gray-750'}`}
                    onClick={() => handleSelectLabel(label.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Avatar className="h-12 w-12 mr-3 bg-transparent">
                            <AvatarImage src={label.logoPath} alt={label.name} />
                            <AvatarFallback className="bg-purple-900">{label.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <CardTitle className="text-xl text-white">{label.name}</CardTitle>
                        </div>
                        <span className="bg-blue-600 px-3 py-1 rounded-full text-xs font-medium text-white">
                          Level {label.levelRequired}+
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-300 mb-3">{label.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-400">Reputation:</span>
                            <span className="text-white">{label.reputation}/100</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-1.5 mb-3">
                            <div className="bg-purple-600 h-1.5 rounded-full" style={{width: `${label.reputation}%`}}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-400">Marketing:</span>
                            <span className="text-white">{label.marketingPower}/100</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-1.5 mb-3">
                            <div className="bg-blue-600 h-1.5 rounded-full" style={{width: `${label.marketingPower}%`}}></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {label.genres.map((genre, index) => (
                          <span key={index} className="text-xs px-2 py-1 bg-gray-700 rounded-full text-white">
                            {genre}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 flex justify-between text-sm text-gray-300">
                      <div>Royalty: {Math.round(label.royaltyRate * 100)}%</div>
                      <div>Advance: ${formatNumber(label.advanceAmount)}</div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <p className="text-gray-400 italic col-span-2">No labels available at your current level</p>
              )}
            </div>
            
            {selectedLabelId && (
              <div className="mt-6">
                <button 
                  onClick={handleSignWithLabel}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold py-3 px-4 rounded"
                >
                  Sign with {getLabelById(selectedLabelId)?.name || 'Label'}
                </button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recordLabels.map(label => (
                <Card 
                  key={label.id} 
                  className={`bg-gray-800 border-0 transition-all ${
                    label.levelRequired > (stats.careerLevel || 1) 
                      ? 'opacity-60 cursor-not-allowed' 
                      : 'hover:bg-gray-750'
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Avatar className="h-12 w-12 mr-3 bg-transparent">
                          <AvatarImage src={label.logoPath} alt={label.name} />
                          <AvatarFallback className="bg-purple-900">{label.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-xl text-white">{label.name}</CardTitle>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                        label.levelRequired > (stats.careerLevel || 1) 
                          ? 'bg-red-600' 
                          : 'bg-blue-600'
                      }`}>
                        Level {label.levelRequired}+
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-300 mb-3">{label.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-400">Reputation:</span>
                          <span className="text-white">{label.reputation}/100</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5 mb-3">
                          <div className="bg-purple-600 h-1.5 rounded-full" style={{width: `${label.reputation}%`}}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-400">Marketing:</span>
                          <span className="text-white">{label.marketingPower}/100</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5 mb-3">
                          <div className="bg-blue-600 h-1.5 rounded-full" style={{width: `${label.marketingPower}%`}}></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {label.genres.map((genre, index) => (
                        <span key={index} className="text-xs px-2 py-1 bg-gray-700 rounded-full text-white">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-between text-sm text-gray-300">
                    <div>Royalty: {Math.round(label.royaltyRate * 100)}%</div>
                    <div>Advance: ${formatNumber(label.advanceAmount)}</div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  // Determine which view to render
  const renderContent = () => {
    switch (viewState) {
      case 'create':
        return renderCreateCompany();
      case 'overview':
        return renderCompanyOverview();
      case 'manage':
        return renderManageEmployees();
      case 'artists':
        return renderManageArtists();
      case 'labels':
        return renderLabelsView();
      case 'calendar':
        return renderCalendar();
      default:
        return company ? renderCompanyOverview() : renderCreateCompany();
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">Company Management</h1>
      {renderContent()}
    </div>
  );
};

export default CompanyManagement;