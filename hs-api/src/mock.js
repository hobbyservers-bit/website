/**
 * Mock data returned while the real API is unreachable.
 * Remove or replace once the real API is live.
 */

export const MOCK_SERVERS = [
  { id:'1', name:'SMP World',         subdomain:'smp-world',    motd:'A friendly survival server!',        status:'ONLINE',  max_players:20, tag_ids:['survival','smp'],  rating_positive:188, port:25565, icon_material:'GRASS_BLOCK',    icon_rarity:'COMMON'   },
  { id:'2', name:'PvP Arena',          subdomain:'pvp-arena',    motd:'Battle it out in the arena!',        status:'ONLINE',  max_players:50, tag_ids:['competitive'],     rating_positive:145, port:25565, icon_material:'ANVIL',          icon_rarity:'UNCOMMON' },
  { id:'3', name:'Creative Hub',       subdomain:'creative-hub', motd:'Build anything you can imagine',     status:'ONLINE',  max_players:30, tag_ids:['creative'],        rating_positive:89,  port:25565, icon_material:'COBBLESTONE',    icon_rarity:'COMMON'   },
  { id:'4', name:'Modded Adventure',   subdomain:'modded-adv',   motd:'Fully modded 1.20 with 200+ mods!', status:'ONLINE',  max_players:15, tag_ids:['modded'],          rating_positive:67,  port:25565, icon_material:'AMETHYST_BLOCK', icon_rarity:'EPIC'     },
  { id:'5', name:'Family Survival',    subdomain:'family-surv',  motd:'Safe and fun for all ages',          status:'ONLINE',  max_players:20, tag_ids:['family_friendly'], rating_positive:54,  port:25565, icon_material:'OAK_SAPLING',   icon_rarity:'UNCOMMON' },
  { id:'6', name:'Economy Empire',     subdomain:'economy',      motd:'Build your fortune',                 status:'OFFLINE', max_players:40, tag_ids:['economy'],         rating_positive:41,  port:25565, icon_material:'EMERALD_BLOCK',  icon_rarity:'RARE'     },
];

export const MOCK_TAGS = [
  { id:'1',  name:'smp',             display_name:'SMP',             emoji:'⚔️'  },
  { id:'2',  name:'creative',        display_name:'Creative',        emoji:'🎨'  },
  { id:'3',  name:'minigames',       display_name:'Minigames',       emoji:'🎮'  },
  { id:'4',  name:'survival',        display_name:'Survival',        emoji:'🌲'  },
  { id:'5',  name:'modded',          display_name:'Modded',          emoji:'🧩'  },
  { id:'6',  name:'competitive',     display_name:'Competitive',     emoji:'🏆'  },
  { id:'7',  name:'casual',          display_name:'Casual',          emoji:'😊'  },
  { id:'8',  name:'economy',         display_name:'Economy',         emoji:'💰'  },
  { id:'9',  name:'roleplay',        display_name:'Roleplay',        emoji:'🎭'  },
  { id:'10', name:'family_friendly', display_name:'Family Friendly', emoji:'👨‍👩‍👧' },
];
