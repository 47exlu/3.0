import React, { useState } from 'react';
import { useRapperGame } from '../../lib/stores/useRapperGame';
import { toast } from 'react-hot-toast';
import { formatNumber } from '../../lib/utils';
import { v4 as uuidv4 } from 'uuid';

const CompanyManagement: React.FC = () => {
  const {
    company,
    aiRappers,
    stats,
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
  const [viewState, setViewState] = useState<'overview' | 'create' | 'manage' | 'artists'>(
    company ? 'overview' : 'create'
  );

  // Cost calculation
  const startupCost = 10000;
  const costPerEmployee = company ? 500 * company.level : 500;

  // Handle company creation
  const handleCreateCompany = () => {
    if (!companyName) {
      toast.error('Please enter a company name');
      return;
    }

    if (stats.reputation < 25) {
      toast.error('You need at least 25 reputation to start a company');
      return;
    }

    if (stats.wealth < startupCost) {
      toast.error(`You need at least $${formatNumber(startupCost)} to start a company`);
      return;
    }

    const companyId = createCompany(companyName, companyType, companyDescription);
    
    if (companyId) {
      toast.success(`${companyName} has been successfully created!`);
      setViewState('overview');
    } else {
      toast.error('Failed to create company. Please check requirements.');
    }
  };

  // Handle hiring employees
  const handleHireEmployees = () => {
    const hireCost = costPerEmployee * employeeCount;
    
    if (stats.wealth < hireCost) {
      toast.error(`You need $${formatNumber(hireCost)} to hire ${employeeCount} employees`);
      return;
    }
    
    hireCompanyEmployee(employeeCount);
    toast.success(`Hired ${employeeCount} new employees`);
  };

  // Handle firing employees
  const handleFireEmployees = () => {
    const maxFireable = Math.max(0, (company?.employees || 1) - 1);
    
    if (employeeCount > maxFireable) {
      toast.error(`You can't fire more than ${maxFireable} employees`);
      return;
    }
    
    if (employeeCount <= 0) {
      toast.error('Please enter a valid number of employees to fire');
      return;
    }
    
    const fireCost = (costPerEmployee / 2) * employeeCount; // Severance cost
    
    if (stats.wealth < fireCost) {
      toast.error(`You need $${formatNumber(fireCost)} for severance packages`);
      return;
    }
    
    fireCompanyEmployee(employeeCount);
    toast.success(`Let go of ${employeeCount} employees`);
  };

  // Handle signing an artist
  const handleSignArtist = (artistId: string) => {
    if (company?.type !== 'record_label') {
      toast.error('Only record labels can sign artists');
      return;
    }
    
    const artist = aiRappers.find(a => a.id === artistId);
    if (!artist) return;
    
    const signingCost = artist.popularity * 1000;
    
    if (stats.wealth < signingCost) {
      toast.error(`You need $${formatNumber(signingCost)} to sign ${artist.name}`);
      return;
    }
    
    const success = signArtist(artistId);
    
    if (success) {
      toast.success(`Signed ${artist.name} to your label!`);
    } else {
      toast.error(`Failed to sign ${artist.name}. Please check requirements.`);
    }
  };

  // Handle dropping an artist
  const handleDropArtist = (artistId: string) => {
    if (company?.type !== 'record_label') {
      toast.error('Only record labels can drop artists');
      return;
    }
    
    const artist = aiRappers.find(a => a.id === artistId);
    if (!artist) return;
    
    const terminationFee = artist.popularity * 500;
    
    if (stats.wealth < terminationFee) {
      toast.error(`You need $${formatNumber(terminationFee)} for contract termination`);
      return;
    }
    
    const success = dropArtist(artistId);
    
    if (success) {
      toast.success(`Dropped ${artist.name} from your label`);
    } else {
      toast.error(`Failed to drop ${artist.name}. Please check requirements.`);
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
        
        <div className="flex space-x-3">
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