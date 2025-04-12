import React, { useState } from 'react';
import { useRapperGame } from '../../lib/stores/useRapperGame';
import { 
  Award, 
  DollarSign, 
  ArrowUp, 
  ArrowDown, 
  Users, 
  PieChart, 
  Building, 
  Globe, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Clock,
  Star,
  Percent
} from 'lucide-react';
import { formatCurrency, formatNumber } from '../../lib/utils';

type LabelTier = 'indie' | 'small' | 'major' | 'global';

interface RecordLabel {
  id: string;
  name: string;
  tier: LabelTier;
  advanceAmount: number;
  royaltyRate: number;
  marketingBudget: number;
  exclusivity: number; // Number of albums/songs exclusive to label
  contractLength: number; // In weeks
  reputation: number; // Required reputation to unlock
  artists: string[]; // Other artists on the label
}

const recordLabels: RecordLabel[] = [
  {
    id: 'indie1',
    name: 'Breakthrough Records',
    tier: 'indie',
    advanceAmount: 25000,
    royaltyRate: 0.25,
    marketingBudget: 10000,
    exclusivity: 1,
    contractLength: 52, // 1 year
    reputation: 0,
    artists: ['Local Beat', 'Urban Flow', 'Rise Up']
  },
  {
    id: 'indie2',
    name: 'New Wave Studios',
    tier: 'indie',
    advanceAmount: 35000,
    royaltyRate: 0.20,
    marketingBudget: 15000,
    exclusivity: 2,
    contractLength: 104, // 2 years
    reputation: 200,
    artists: ['Next Up', 'The Movement', 'Street Poetry']
  },
  {
    id: 'small1',
    name: 'Urban Collective',
    tier: 'small',
    advanceAmount: 75000,
    royaltyRate: 0.18,
    marketingBudget: 40000,
    exclusivity: 2,
    contractLength: 104, // 2 years
    reputation: 500,
    artists: ['Metro Beats', 'City Lights', 'Rhythm Section']
  },
  {
    id: 'small2',
    name: 'Rhythm Republic',
    tier: 'small',
    advanceAmount: 100000,
    royaltyRate: 0.15,
    marketingBudget: 60000,
    exclusivity: 3,
    contractLength: 156, // 3 years
    reputation: 750,
    artists: ['Soul Wave', 'The Collective', 'Beat Masters']
  },
  {
    id: 'major1',
    name: 'Empire Records',
    tier: 'major',
    advanceAmount: 250000,
    royaltyRate: 0.12,
    marketingBudget: 150000,
    exclusivity: 3,
    contractLength: 208, // 4 years
    reputation: 1500,
    artists: ['City Rhymes', 'Global Sound', 'Platinum Mic']
  },
  {
    id: 'major2',
    name: 'Universal Beat',
    tier: 'major',
    advanceAmount: 500000,
    royaltyRate: 0.10,
    marketingBudget: 250000,
    exclusivity: 4,
    contractLength: 260, // 5 years
    reputation: 2500,
    artists: ['World Stage', 'Ultimate Flow', 'Chart Toppers']
  },
  {
    id: 'global1',
    name: 'Global Entertainment',
    tier: 'global',
    advanceAmount: 1000000,
    royaltyRate: 0.08,
    marketingBudget: 500000,
    exclusivity: 5,
    contractLength: 312, // 6 years
    reputation: 5000,
    artists: ['Worldwide', 'Elite Sound', 'Legend Status']
  }
];

// Function to determine tier color
const getTierColor = (tier: LabelTier): string => {
  switch (tier) {
    case 'indie': return 'text-green-400';
    case 'small': return 'text-blue-400';
    case 'major': return 'text-purple-400';
    case 'global': return 'text-yellow-400';
    default: return 'text-gray-400';
  }
};

// Function to determine tier stars
const getTierStars = (tier: LabelTier): number => {
  switch (tier) {
    case 'indie': return 1;
    case 'small': return 2;
    case 'major': return 3;
    case 'global': return 4;
    default: return 0;
  }
};

export const RecordDeal: React.FC = () => {
  const { stats, currentWeek } = useRapperGame();
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [contractSigned, setContractSigned] = useState(false);
  
  // Filter labels based on player reputation
  const availableLabels = recordLabels.filter(label => label.reputation <= (stats?.reputation || 0));
  const selectedLabel = selectedLabelId ? recordLabels.find(l => l.id === selectedLabelId) : null;
  
  const handleSignContract = () => {
    if (!selectedLabel) return;
    
    // Handle signing contract
    setContractSigned(true);
    setShowConfirmation(false);
    
    // We would typically update the game state here
    const newRecordDeal = {
      labelId: selectedLabel.id,
      labelName: selectedLabel.name,
      tier: selectedLabel.tier,
      advanceAmount: selectedLabel.advanceAmount,
      royaltyRate: selectedLabel.royaltyRate,
      marketingBudget: selectedLabel.marketingBudget,
      exclusivity: selectedLabel.exclusivity,
      contractLength: selectedLabel.contractLength,
      startWeek: currentWeek,
      endWeek: currentWeek + selectedLabel.contractLength,
      signupBonus: selectedLabel.advanceAmount
    };
    
    // Add this to the state management in a real implementation
    console.log('Record deal signed:', newRecordDeal);
  };
  
  return (
    <div className="p-4 sm:p-6 text-white">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Record Deal Offers</h1>
        <p className="text-gray-400">Negotiate and sign a deal with a record label to boost your career</p>
      </div>
      
      {/* Current Status */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <h2 className="text-xl font-bold mb-2 flex items-center">
          <Building className="mr-2 h-5 w-5" />
          Current Status
        </h2>
        {contractSigned ? (
          <div>
            <div className="flex items-center mb-2">
              <CheckCircle className="text-green-500 mr-2 h-5 w-5" />
              <span className="font-semibold">You are currently signed to {selectedLabel?.name}</span>
            </div>
            <p className="text-gray-400 mb-4">Contract expires in Week {currentWeek + (selectedLabel?.contractLength || 0)}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-700 rounded p-3">
                <p className="text-xs text-gray-400 mb-1">Advance Amount</p>
                <p className="font-bold">{formatCurrency(selectedLabel?.advanceAmount || 0)}</p>
              </div>
              <div className="bg-gray-700 rounded p-3">
                <p className="text-xs text-gray-400 mb-1">Royalty Rate</p>
                <p className="font-bold">{(selectedLabel?.royaltyRate || 0) * 100}%</p>
              </div>
              <div className="bg-gray-700 rounded p-3">
                <p className="text-xs text-gray-400 mb-1">Marketing Budget</p>
                <p className="font-bold">{formatCurrency(selectedLabel?.marketingBudget || 0)}</p>
              </div>
              <div className="bg-gray-700 rounded p-3">
                <p className="text-xs text-gray-400 mb-1">Exclusivity</p>
                <p className="font-bold">{selectedLabel?.exclusivity || 0} Projects</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            <XCircle className="text-gray-500 mr-2 h-5 w-5" />
            <span>You are currently unsigned (independent artist)</span>
          </div>
        )}
      </div>
      
      {!contractSigned && (
        <>
          {/* Available Label Offers */}
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Globe className="mr-2 h-5 w-5" />
            Available Label Offers
          </h2>
          
          {availableLabels.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-6 text-center">
              <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
              <h3 className="text-lg font-bold mb-2">No Record Deals Available</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Increase your reputation by releasing more music and growing your fanbase to attract record label offers.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {availableLabels.map((label) => (
                <div 
                  key={label.id}
                  className={`bg-gray-800 border rounded-lg p-4 transition-all cursor-pointer hover:bg-gray-700 ${
                    selectedLabelId === label.id 
                      ? 'border-blue-500 ring-2 ring-blue-500/50' 
                      : 'border-gray-700'
                  }`}
                  onClick={() => setSelectedLabelId(label.id)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg">{label.name}</h3>
                      <div className="flex items-center mt-1">
                        <span className={`text-sm ${getTierColor(label.tier)}`}>
                          {label.tier.charAt(0).toUpperCase() + label.tier.slice(1)} Label
                        </span>
                        <span className="flex ml-2">
                          {Array.from({ length: getTierStars(label.tier) }).map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${getTierColor(label.tier)}`} />
                          ))}
                        </span>
                      </div>
                    </div>
                    <div className={`p-1 rounded-full ${getTierColor(label.tier).replace('text-', 'bg-')}/20`}>
                      <Building className={`h-5 w-5 ${getTierColor(label.tier)}`} />
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm flex items-center">
                        <DollarSign className="h-3 w-3 mr-1" /> Advance
                      </span>
                      <span className="font-medium">{formatCurrency(label.advanceAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm flex items-center">
                        <Percent className="h-3 w-3 mr-1" /> Royalty Rate
                      </span>
                      <span className="font-medium">{(label.royaltyRate * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm flex items-center">
                        <PieChart className="h-3 w-3 mr-1" /> Marketing
                      </span>
                      <span className="font-medium">{formatCurrency(label.marketingBudget)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm flex items-center">
                        <Clock className="h-3 w-3 mr-1" /> Contract Length
                      </span>
                      <span className="font-medium">{label.contractLength / 52} years</span>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-700">
                    <p className="text-xs text-gray-400 mb-1">Other artists on this label:</p>
                    <div className="flex flex-wrap gap-1">
                      {label.artists.map((artist, idx) => (
                        <span key={idx} className="text-xs bg-gray-700 rounded-full px-2 py-0.5">{artist}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Contract Details */}
          {selectedLabel && (
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                Contract Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 border-b border-gray-700 pb-2">Financial Terms</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Advance Payment</p>
                      <p className="text-xl font-bold">{formatCurrency(selectedLabel.advanceAmount)}</p>
                      <p className="text-xs text-gray-500">Paid immediately upon signing</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Royalty Rate</p>
                      <p className="text-xl font-bold">{(selectedLabel.royaltyRate * 100).toFixed(0)}%</p>
                      <p className="text-xs text-gray-500">Percentage of revenue you keep</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Marketing Budget</p>
                      <p className="text-xl font-bold">{formatCurrency(selectedLabel.marketingBudget)}</p>
                      <p className="text-xs text-gray-500">For promotion of your releases</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3 border-b border-gray-700 pb-2">Contract Terms</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Contract Length</p>
                      <p className="text-xl font-bold">{selectedLabel.contractLength / 52} years</p>
                      <p className="text-xs text-gray-500">{selectedLabel.contractLength} weeks commitment</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Exclusivity</p>
                      <p className="text-xl font-bold">{selectedLabel.exclusivity} projects</p>
                      <p className="text-xs text-gray-500">Minimum required releases</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Label Tier</p>
                      <p className="text-xl font-bold flex items-center">
                        <span className={getTierColor(selectedLabel.tier)}>
                          {selectedLabel.tier.charAt(0).toUpperCase() + selectedLabel.tier.slice(1)}
                        </span>
                        <span className="flex ml-2">
                          {Array.from({ length: getTierStars(selectedLabel.tier) }).map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${getTierColor(selectedLabel.tier)}`} />
                          ))}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3 border-b border-gray-700 pb-2">Benefits</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Access to professional promotion</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Industry connections and opportunities</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Distribution on all major platforms</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Media coverage and press opportunities</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Enhanced reputation in the industry</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Sign Contract Button */}
              <div className="mt-6 text-center">
                <button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 rounded-lg font-bold transition-all"
                  onClick={() => setShowConfirmation(true)}
                >
                  Sign Contract with {selectedLabel.name}
                </button>
                <p className="text-sm text-gray-400 mt-2">
                  This action cannot be undone until the contract expires
                </p>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Confirmation Modal */}
      {showConfirmation && selectedLabel && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Record Deal</h3>
            <p className="mb-6">
              Are you sure you want to sign a {selectedLabel.contractLength / 52}-year contract with {selectedLabel.name}? 
              You will receive an advance of {formatCurrency(selectedLabel.advanceAmount)} but will be bound to this label's 
              terms until the contract expires.
            </p>
            <div className="flex gap-4">
              <button 
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded flex-1 font-medium"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
              <button 
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded flex-1 font-medium"
                onClick={handleSignContract}
              >
                Sign Contract
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordDeal;