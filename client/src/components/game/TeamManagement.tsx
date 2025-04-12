import React, { useState } from 'react';
import { useRapperGame } from '@/lib/stores/useRapperGame';
import { TeamMember } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  UserPlus, 
  UserMinus, 
  DollarSign, 
  Briefcase, 
  TrendingUp, 
  Award, 
  Users, 
  Radio, 
  Info, 
  Check, 
  Clock 
} from 'lucide-react';

export function TeamManagement() {
  const { 
    teamMembers, 
    availableTeamMembers, 
    hireTeamMember, 
    fireTeamMember, 
    currentWeek,
    stats
  } = useRapperGame();
  
  const [activeTab, setActiveTab] = useState('current');
  
  // Helper to display team member benefits
  const displayBenefits = (member: TeamMember) => {
    if (!member.benefits || member.benefits.length === 0) {
      return <p className="text-gray-400 text-sm mt-2">No specific benefits listed.</p>;
    }
    
    return (
      <ul className="mt-2 space-y-1">
        {member.benefits.map((benefit, index) => (
          <li key={index} className="flex items-start space-x-1 text-sm">
            <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-200">{benefit.description}</span>
          </li>
        ))}
      </ul>
    );
  };

  // Get benefits icon based on type
  const getBenefitIcon = (type: string) => {
    switch (type) {
      case 'marketing':
        return <TrendingUp className="h-4 w-4 text-pink-400" />;
      case 'negotiation':
        return <DollarSign className="h-4 w-4 text-green-400" />;
      case 'networking':
        return <Users className="h-4 w-4 text-blue-400" />;
      case 'reputation':
        return <Award className="h-4 w-4 text-yellow-400" />;
      case 'streaming':
        return <Radio className="h-4 w-4 text-purple-400" />;
      default:
        return <Briefcase className="h-4 w-4 text-gray-400" />;
    }
  };

  // Component for each team member card
  const TeamMemberCard = ({ member, isHired = false }: { member: TeamMember, isHired?: boolean }) => {
    const canAfford = stats.wealth >= member.salary;
    const meetsLevel = !member.levelRequirement || stats.careerLevel >= member.levelRequirement;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <Card className="bg-gray-800 border-gray-700 overflow-hidden">
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-white">{member.name}</h3>
                <p className="text-sm text-gray-400">{member.role}</p>
              </div>
              <Badge 
                variant="outline" 
                className="bg-gray-700 text-pink-300 border-pink-500"
              >
                ${member.salary.toLocaleString()}/week
              </Badge>
            </div>
            
            {member.levelRequirement && (
              <div className="mt-3 flex items-center space-x-1 text-xs text-gray-400">
                <Clock className="h-3.5 w-3.5" />
                <span>Requires career level {member.levelRequirement}</span>
              </div>
            )}
            
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-300 flex items-center space-x-1">
                <Info className="h-4 w-4 text-blue-400" />
                <span>Description</span>
              </h4>
              <p className="mt-1 text-sm text-gray-300">{member.description || member.bio}</p>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-300 flex items-center space-x-1">
                <Award className="h-4 w-4 text-yellow-400" />
                <span>Benefits</span>
              </h4>
              {displayBenefits(member)}
            </div>
            
            {isHired ? (
              <div className="mt-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Badge variant="secondary" className="bg-blue-900/30 text-blue-300 border-blue-600">
                    Hired Week {member.hiredWeek || member.hiredDate}
                  </Badge>
                  <Badge variant="secondary" className="bg-green-900/30 text-green-300 border-green-600">
                    {currentWeek - (member.hiredWeek || member.hiredDate || 0)} weeks employed
                  </Badge>
                </div>
                <Button 
                  variant="destructive" 
                  className="w-full mt-2 bg-red-600 hover:bg-red-700"
                  onClick={() => fireTeamMember(member.id)}
                >
                  <UserMinus className="h-4 w-4 mr-2" />
                  Fire {member.name}
                </Button>
              </div>
            ) : (
              <div className="mt-6">
                <Button 
                  variant="default" 
                  className="w-full"
                  disabled={!canAfford || !meetsLevel}
                  onClick={() => hireTeamMember(member.id)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Hire {member.name}
                </Button>
                
                {!canAfford && (
                  <p className="text-red-400 text-xs mt-2 text-center">
                    You need ${member.salary.toLocaleString()} to hire this team member
                  </p>
                )}
                
                {!meetsLevel && member.levelRequirement && (
                  <p className="text-red-400 text-xs mt-2 text-center">
                    Requires career level {member.levelRequirement} (current: {stats.careerLevel})
                  </p>
                )}
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
              Team Management
            </h1>
            <p className="text-gray-400 mt-1">
              Build your team to help navigate the music industry
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-gray-800 py-2 px-4 rounded-lg border border-gray-700">
              <div className="text-xs text-gray-400">Weekly Team Cost</div>
              <div className="text-lg font-bold text-green-400">
                ${teamMembers?.reduce((total, member) => total + member.salary, 0)?.toLocaleString() || '0'}/week
              </div>
            </div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger 
              value="current" 
              className="data-[state=active]:bg-gray-700"
            >
              Current Team 
              <Badge variant="outline" className="ml-2 bg-transparent border-gray-600">
                {teamMembers?.length || 0}
              </Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="available" 
              className="data-[state=active]:bg-gray-700"
            >
              Available to Hire
              <Badge variant="outline" className="ml-2 bg-transparent border-gray-600">
                {availableTeamMembers?.length || 0}
              </Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="mt-6">
            {(!teamMembers || teamMembers.length === 0) ? (
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 mx-auto text-gray-600" />
                <h3 className="mt-4 text-lg font-medium text-gray-400">No Team Members Hired</h3>
                <p className="mt-2 text-gray-500 max-w-md mx-auto">
                  Your team helps you navigate the music industry. Hire professionals to boost your career!
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setActiveTab('available')}
                >
                  View Available Team Members
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teamMembers?.map(member => (
                  <TeamMemberCard key={member.id} member={member} isHired={true} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="available" className="mt-6">
            {(!availableTeamMembers || availableTeamMembers.length === 0) ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-gray-600" />
                <h3 className="mt-4 text-lg font-medium text-gray-400">No Available Team Members</h3>
                <p className="mt-2 text-gray-500 max-w-md mx-auto">
                  You've hired all available team members or none are available at your current career level.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availableTeamMembers?.map(member => (
                  <TeamMemberCard key={member.id} member={member} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h3 className="text-lg font-medium text-white flex items-center">
            <Info className="h-5 w-5 mr-2 text-blue-400" />
            Team Management Tips
          </h3>
          <ul className="mt-4 space-y-3">
            <li className="flex items-start space-x-3">
              <div className="bg-blue-900/30 p-1.5 rounded-full text-blue-400 mt-0.5">
                <DollarSign className="h-4 w-4" />
              </div>
              <div>
                <p className="text-gray-300">Team members are paid weekly from your wealth.</p>
                <p className="text-gray-500 text-sm">If you can't afford their salaries, they might quit.</p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <div className="bg-green-900/30 p-1.5 rounded-full text-green-400 mt-0.5">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <p className="text-gray-300">Different team members provide unique benefits.</p>
                <p className="text-gray-500 text-sm">Managers boost marketing, publicists improve your reputation.</p>
              </div>
            </li>
            <li className="flex items-start space-x-3">
              <div className="bg-purple-900/30 p-1.5 rounded-full text-purple-400 mt-0.5">
                <Award className="h-4 w-4" />
              </div>
              <div>
                <p className="text-gray-300">Higher career levels unlock better team members.</p>
                <p className="text-gray-500 text-sm">Keep advancing your career to access elite industry professionals.</p>
              </div>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

export default TeamManagement;