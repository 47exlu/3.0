import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRapperGame } from '@/lib/stores/useRapperGame';
import { useAudio } from '@/lib/stores/useAudio';
import { MicrophoneIcon } from '@/assets/icons';
import {
  AppearanceStyle,
  FashionStyle,
  HairStyle,
  AccessoryType,
  MusicStyle,
  CharacterAppearance,
  CharacterInfo
} from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export function ArtistCustomization() {
  const { createCharacter, setScreen } = useRapperGame();
  const { playSuccess } = useAudio();
  
  // Basic info
  const [name, setName] = useState('');
  const [artistName, setArtistName] = useState('');
  const [age, setAge] = useState('20');
  const [country, setCountry] = useState('USA');
  const [about, setAbout] = useState('');
  
  // Style and appearance
  const [musicStyle, setMusicStyle] = useState<MusicStyle>('trap');
  const [appearanceStyle, setAppearanceStyle] = useState<AppearanceStyle>('modern');
  const [fashionStyle, setFashionStyle] = useState<FashionStyle>('streetwear');
  const [hairStyle, setHairStyle] = useState<HairStyle>('fade');
  const [colorScheme, setColorScheme] = useState('#ffab00');
  
  // Accessories (multiple selection)
  const [accessories, setAccessories] = useState<AccessoryType[]>(['chains']);
  
  const handleAccessoryChange = (accessory: AccessoryType) => {
    if (accessories.includes(accessory)) {
      setAccessories(accessories.filter(a => a !== accessory));
    } else {
      setAccessories([...accessories, accessory]);
    }
  };
  
  const handleCreateCharacter = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim() || !artistName.trim() || !age || !country) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Create the appearance object
    const appearance: CharacterAppearance = {
      appearanceStyle: appearanceStyle,
      fashionStyle: fashionStyle,
      hairStyle: hairStyle,
      accessories: accessories,
      colorScheme: colorScheme
    };
    
    // Create character with enhanced details
    playSuccess();
    const characterInfo: CharacterInfo = {
      id: uuidv4(), // Generate a unique ID for the character
      name,
      artistName,
      age: parseInt(age, 10),
      country,
      careerStartWeek: 1,
      about: about || undefined,
      musicStyle,
      appearance
    };
    createCharacter(characterInfo);
  };
  
  // Color presets for brand identity
  const colorPresets = [
    { name: 'Gold', value: '#ffab00' },
    { name: 'Silver', value: '#c0c0c0' },
    { name: 'Platinum', value: '#e5e4e2' },
    { name: 'Red', value: '#ff3d00' },
    { name: 'Blue', value: '#0091ea' },
    { name: 'Purple', value: '#aa00ff' },
    { name: 'Green', value: '#00c853' },
    { name: 'Black', value: '#212121' },
  ];
  
  return (
    <div className="flex items-center justify-center min-h-full bg-gradient-to-b from-indigo-900 via-purple-900 to-black p-6">
      <Card className="w-full max-w-4xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl text-white">
        <CardContent className="pt-8">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-3 rounded-full shadow-lg mr-3">
              <MicrophoneIcon size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">Create Your Artist</h1>
          </div>
          
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid grid-cols-2 mb-8 bg-black/40 border border-white/10 rounded-xl p-1">
              <TabsTrigger 
                value="basic" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-black data-[state=active]:font-medium data-[state=active]:shadow-md rounded-lg"
              >
                Basic Info
              </TabsTrigger>
              <TabsTrigger 
                value="appearance"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-black data-[state=active]:font-medium data-[state=active]:shadow-md rounded-lg"
              >
                Style & Appearance
              </TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleCreateCharacter}>
              <TabsContent value="basic" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name <span className="text-amber-500">*</span></Label>
                  <Input 
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="bg-black/50 border border-white/10 rounded-xl focus:border-amber-500/50 focus:ring-amber-500/20 transition-all"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="artistName">Artist Name <span className="text-amber-500">*</span></Label>
                  <Input 
                    id="artistName"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    placeholder="Lil Something"
                    className="bg-black/50 border border-white/10 rounded-xl focus:border-amber-500/50 focus:ring-amber-500/20 transition-all"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age <span className="text-amber-500">*</span></Label>
                    <Select value={age} onValueChange={setAge} required>
                      <SelectTrigger className="bg-black/50 border border-white/10 rounded-xl focus:border-amber-500/50 focus:ring-amber-500/20 transition-all">
                        <SelectValue placeholder="Select age" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border border-white/10 backdrop-blur-lg text-white">
                        {Array.from({ length: 22 }, (_, i) => i + 16).map((a) => (
                          <SelectItem key={a} value={a.toString()}>
                            {a}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="country">Country <span className="text-amber-500">*</span></Label>
                    <Select value={country} onValueChange={setCountry} required>
                      <SelectTrigger className="bg-black/50 border border-white/10 rounded-xl focus:border-amber-500/50 focus:ring-amber-500/20 transition-all">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border border-white/10 backdrop-blur-lg text-white">
                        <SelectItem value="USA">USA</SelectItem>
                        <SelectItem value="UK">UK</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="Australia">Australia</SelectItem>
                        <SelectItem value="France">France</SelectItem>
                        <SelectItem value="Germany">Germany</SelectItem>
                        <SelectItem value="Japan">Japan</SelectItem>
                        <SelectItem value="Brazil">Brazil</SelectItem>
                        <SelectItem value="South Korea">South Korea</SelectItem>
                        <SelectItem value="Nigeria">Nigeria</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="about">About (Bio)</Label>
                  <Input 
                    id="about"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="A brief description of your artist's background and story"
                    className="bg-black/50 border border-white/10 rounded-xl focus:border-amber-500/50 focus:ring-amber-500/20 transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="musicStyle">Music Style</Label>
                  <Select value={musicStyle} onValueChange={(val) => setMusicStyle(val as MusicStyle)}>
                    <SelectTrigger className="bg-black/50 border border-white/10 rounded-xl focus:border-amber-500/50 focus:ring-amber-500/20 transition-all">
                      <SelectValue placeholder="Select music style" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border border-white/10 backdrop-blur-lg text-white">
                      <SelectItem value="trap">Trap</SelectItem>
                      <SelectItem value="boom-bap">Boom Bap</SelectItem>
                      <SelectItem value="melodic">Melodic</SelectItem>
                      <SelectItem value="drill">Drill</SelectItem>
                      <SelectItem value="conscious">Conscious</SelectItem>
                      <SelectItem value="experimental">Experimental</SelectItem>
                      <SelectItem value="mainstream">Mainstream</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-2 flex justify-end">
                  <Button 
                    type="button"
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 transition-all py-3 px-4 rounded-xl text-black font-medium shadow-md hover:shadow-lg hover:shadow-amber-600/20"
                    onClick={() => {
                      const tab = document.querySelector('[data-value="appearance"]');
                      if (tab) {
                        // Create and dispatch click event
                        const clickEvent = new MouseEvent('click', {
                          view: window,
                          bubbles: true,
                          cancelable: true
                        });
                        tab.dispatchEvent(clickEvent);
                      }
                    }}
                  >
                    Next: Style & Appearance
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="appearance" className="space-y-4">
                <ScrollArea className="h-[400px]">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="appearanceStyle">Overall Style</Label>
                    <Select value={appearanceStyle} onValueChange={(val) => setAppearanceStyle(val as AppearanceStyle)}>
                      <SelectTrigger className="bg-black/50 border border-white/10 rounded-xl focus:border-amber-500/50 focus:ring-amber-500/20 transition-all">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border border-white/10 backdrop-blur-lg text-white">
                        <SelectItem value="classic">Classic</SelectItem>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="alternative">Alternative</SelectItem>
                        <SelectItem value="underground">Underground</SelectItem>
                        <SelectItem value="mainstream">Mainstream</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fashionStyle">Fashion Style</Label>
                    <Select value={fashionStyle} onValueChange={(val) => setFashionStyle(val as FashionStyle)}>
                      <SelectTrigger className="bg-black/50 border border-white/10 rounded-xl focus:border-amber-500/50 focus:ring-amber-500/20 transition-all">
                        <SelectValue placeholder="Select fashion" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border border-white/10 backdrop-blur-lg text-white">
                        <SelectItem value="streetwear">Streetwear</SelectItem>
                        <SelectItem value="high-fashion">High Fashion</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="vintage">Vintage</SelectItem>
                        <SelectItem value="athleisure">Athleisure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hairStyle">Hair Style</Label>
                  <Select value={hairStyle} onValueChange={(val) => setHairStyle(val as HairStyle)}>
                    <SelectTrigger className="bg-black/50 border border-white/10 rounded-xl focus:border-amber-500/50 focus:ring-amber-500/20 transition-all">
                      <SelectValue placeholder="Select hair style" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border border-white/10 backdrop-blur-lg text-white">
                      <SelectItem value="afro">Afro</SelectItem>
                      <SelectItem value="braids">Braids</SelectItem>
                      <SelectItem value="dreadlocks">Dreadlocks</SelectItem>
                      <SelectItem value="fade">Fade</SelectItem>
                      <SelectItem value="long">Long</SelectItem>
                      <SelectItem value="short">Short</SelectItem>
                      <SelectItem value="colored">Colored</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="accessories">Accessories (Select multiple)</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      ['chains', 'Chains'],
                      ['grills', 'Grills'],
                      ['tattoos', 'Tattoos'],
                      ['piercings', 'Piercings'],
                      ['watches', 'Watches'],
                      ['glasses', 'Glasses'],
                      ['none', 'None']
                    ].map(([value, label]) => (
                      <div key={value} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`accessory-${value}`} 
                          checked={accessories.includes(value as AccessoryType)}
                          onCheckedChange={() => handleAccessoryChange(value as AccessoryType)}
                        />
                        <label 
                          htmlFor={`accessory-${value}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="colorScheme">Brand Color Scheme</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {colorPresets.map(({ name, value }) => (
                      <Badge 
                        key={value}
                        variant="outline"
                        className={`cursor-pointer p-2 flex flex-col items-center ${colorScheme === value ? 'ring-2 ring-amber-500 shadow-lg shadow-amber-500/20' : 'border border-white/10'} rounded-xl transition-all hover:shadow-md`}
                        style={{ backgroundColor: `${value}20` }} // Using transparency
                        onClick={() => setColorScheme(value)}
                      >
                        <div 
                          className="w-8 h-8 rounded-full mb-2 shadow-inner border border-white/20" 
                          style={{ backgroundColor: value }}
                        />
                        <span className="text-xs">{name}</span>
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="customColor" className="w-auto">Custom:</Label>
                    <Input 
                      id="customColor"
                      type="color"
                      value={colorScheme}
                      onChange={(e) => setColorScheme(e.target.value)}
                      className="w-12 h-8 p-0 bg-transparent"
                    />
                  </div>
                </div>
                
                <div className="pt-6 flex gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-1/3 border border-white/10 text-gray-300 hover:bg-white/5 hover:border-white/20 transition-all rounded-xl"
                    onClick={() => {
                      const tab = document.querySelector('[data-value="basic"]');
                      if (tab) {
                        const clickEvent = new MouseEvent('click', {
                          view: window,
                          bubbles: true,
                          cancelable: true
                        });
                        tab.dispatchEvent(clickEvent);
                      }
                    }}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    className="w-2/3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 transition-all py-3 px-4 rounded-xl text-black font-medium shadow-md hover:shadow-lg hover:shadow-amber-600/20"
                  >
                    Start Your Career
                  </Button>
                </div>
                </ScrollArea>
              </TabsContent>
            </form>
          </Tabs>
          
          <div className="mt-8 text-center">
            <p className="text-white/80 text-sm font-medium">Your journey to hip-hop stardom begins with who you are.</p>
            <p className="text-xs mt-2 text-white/50">Fields marked with <span className="text-amber-500">*</span> are required</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
