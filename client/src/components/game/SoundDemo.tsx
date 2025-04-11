import React from 'react';
import { useAudio } from '../../lib/stores/useAudio';
import { Button } from '../ui/button';

export const SoundDemo = () => {
  const {
    playHit,
    playClick,
    playSuccess,
    playTransition,
    playPurchase,
    playCash,
    playError,
    isMuted,
    toggleMute,
    volume,
    setVolume
  } = useAudio();

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-amber-300 to-pink-500">
        Sound Effects Demo
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <Button 
          variant="outline" 
          onClick={() => playClick()}
          className="h-16 hover:bg-purple-800/50"
        >
          Play Click Sound
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => playHit()}
          className="h-16 hover:bg-blue-800/50"
        >
          Play Hit Sound
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => playSuccess()}
          className="h-16 hover:bg-green-800/50"
        >
          Play Success Sound
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => playTransition()}
          className="h-16 hover:bg-indigo-800/50"
        >
          Play Transition Sound
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => playPurchase()}
          className="h-16 hover:bg-amber-800/50"
        >
          Play Purchase Sound
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => playCash()}
          className="h-16 hover:bg-yellow-800/50"
        >
          Play Cash Sound
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => playError()}
          className="h-16 hover:bg-red-800/50"
        >
          Play Error Sound
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Volume: {Math.round(volume * 100)}%</span>
          <input 
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-1/2"
          />
        </div>
        
        <Button 
          variant={isMuted ? "destructive" : "default"}
          onClick={() => toggleMute()}
          className="w-full"
        >
          {isMuted ? "Unmute Sounds" : "Mute Sounds"}
        </Button>
      </div>
    </div>
  );
};

export default SoundDemo;