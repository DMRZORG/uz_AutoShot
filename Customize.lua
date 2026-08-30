Customize = {}

-- General
Customize.Command           = 'shotmaker'
Customize.MenuCommand       = 'wardrobe'
Customize.AceRestricted     = false          -- true = ACE permission required (see README)
Customize.RoutingBucket     = 999

Customize.ScreenshotQuality = 0.92          -- 0.0–1.0 (webp/jpg only)
Customize.ScreenshotFormat  = 'webp'        -- 'webp' | 'png' | 'jpg' (webp keeps transparency)
Customize.TransparentBg     = true          -- chroma key removal (webp/png; jpg output falls back to png)
Customize.ScreenshotWidth   = 512
Customize.ScreenshotHeight  = 512

Customize.StudioCoords      = vector3(0.0, 0.0, -150.0)
Customize.StudioHeading     = 180.0

Customize.WaitAfterApply    = 500           -- ms
Customize.WaitAfterCapture  = 300           -- ms
Customize.TextureLoadWait   = 600           -- ms
Customize.CaptureAllTextures = false        -- true = all textures, false = texture 0 only

-- Batch / Performance
Customize.BatchSize         = 10
Customize.BatchPauseWait    = 2000          -- ms
Customize.GCInterval        = 20
Customize.LatentRate        = 8000000       -- bytes/sec for capture upload (latent event throttle).
                                            -- 8 MB/s is plenty for 512x512; raise for 4K source frames
                                            -- (e.g. 16000000 = 16 MB/s) if uploads bottleneck the queue.

-- Chroma Key Screen
Customize.ChromaKeyColor    = 'magenta'          -- 'green' | 'magenta'

Customize.GreenScreen = {
    width       = 8.0,
    depth       = 8.0,
    height      = 8.5,
    floorOffset = -3.0,
}

-- Head Chroma Mask — covers the ped's head with chroma color so the server
-- can wipe it out for accessory/torso shots (configured per category via
-- the `hideHead = true` flag). Each entry is a sphere centered on SKEL_Head
-- plus its own offsets, sized by sizeX/Y/Z, and optionally rotated by
-- rotX/rotY/rotZ (degrees).
--
-- Stack multiple entries to cover head + jaw + neck independently — small
-- spheres tucked exactly where they're needed beat one big sphere that has
-- to compromise between clipping clothing or leaving skin visible.
--
-- Rotation is around the marker center. With unequal sizeX/Y/Z (ellipsoid)
-- you can tilt the shape — e.g. rotX > 0 pitches the sphere's long axis
-- downward, which is useful for following the slope of the neck under the
-- chin without expanding into the chest area.
Customize.HeadMask = {
    { offsetX = 0.0, offsetY = 0.0, offsetZ = 0.136, sizeX = 0.12, sizeY = 0.15, sizeZ = 0.315 },
}

-- Auto-set screen color from preset (do not edit manually)
Customize.GreenScreen.color = Customize.ChromaKeyColor == 'magenta'
    and { r = 255, g = 0, b = 255 }
    or  { r = 0,   g = 177, b = 64 }

-- Studio Lights
Customize.StudioLights = {
    { offset = vector3(0.0, 2.5, 1.0),  range = 8.0, intensity = 3.0 },
    { offset = vector3(-2.5, 0.0, 1.0), range = 5.0, intensity = 2.0 },
    { offset = vector3(2.5, 0.0, 1.0),  range = 5.0, intensity = 2.0 },
    { offset = vector3(0.0, -1.5, 1.0), range = 4.0, intensity = 1.5 },
    { offset = vector3(0.0, 0.0, 3.0),  range = 6.0, intensity = 2.5 },
}

-- Camera Presets (fov, zPos, rotation, dist, defaultAngleH, defaultCamZ, defaultRoll)
Customize.CameraPresets = {
    hair            = { fov = 25.0, zPos = 0.72,  rotation = vector3(0.0, 0.0, 0.0),   dist = 1.2, defaultAngleH = 180.0,  defaultCamZ = 0.0,  defaultRoll = 0.0 },
    face_overlay    = { fov = 18.0, zPos = 0.68,  rotation = vector3(0.0, 0.0, 0.0),   dist = 1.2, defaultAngleH = 180.0,  defaultCamZ = 0.0,  defaultRoll = 0.0 },
    chest_overlay   = { fov = 28.1, zPos = 0.28,  rotation = vector3(0.0, 0.0, 0.0),   dist = 1.2, defaultAngleH = 178.9,  defaultCamZ = 0.06, defaultRoll = 0.0 },
    mask            = { fov = 25.1, zPos = 0.66,  rotation = vector3(0.0, 0.0, 0.0),   dist = 1.2, defaultAngleH = 180.6,  defaultCamZ = 0.0,  defaultRoll = 0.0 },
    arms_gloves     = { fov = 89.4, zPos = 0.07,  rotation = vector3(0.0, 0.0, 0.0),   dist = 0.6, defaultAngleH = 180.6,  defaultCamZ = 0.09, defaultRoll = 0.0 },
    legs            = { fov = 60.0, zPos = -0.46, rotation = vector3(0.0, 0.0, 0.0),   dist = 1.2, defaultAngleH = 179.9,  defaultCamZ = 0.1,  defaultRoll = 0.0 },
    shoes           = { fov = 19.0, zPos = -0.96, rotation = vector3(0.0, 0.0, 0.0),   dist = 1.3, defaultAngleH = 180.3,  defaultCamZ = 0.77, defaultRoll = 0.0 },
    accessories     = { fov = 24.0, zPos = 0.3,   rotation = vector3(0.0, 0.0, 0.0),   dist = 1.2, defaultAngleH = 180.0,  defaultCamZ = 0.0,  defaultRoll = 0.0 },
    body            = { fov = 37.7, zPos = 0.31,  rotation = vector3(0.0, 0.0, 0.0),   dist = 1.3, defaultAngleH = 180.0,  defaultCamZ = 0.0,  defaultRoll = 0.0 },
    decals          = { fov = 56.4, zPos = 0.27,  rotation = vector3(0.0, 0.0, 0.0),   dist = 0.9, defaultAngleH = 0.0,    defaultCamZ = 0.0,  defaultRoll = 0.0 },
    tops            = { fov = 34.7, zPos = 0.22,  rotation = vector3(0.0, 0.0, 0.0),   dist = 1.4, defaultAngleH = 180.0,  defaultCamZ = 0.0,  defaultRoll = 0.0 },
    hats            = { fov = 21.2, zPos = 0.72,  rotation = vector3(0.0, 0.0, 0.0),   dist = 1.2, defaultAngleH = 180.0,  defaultCamZ = 0.0,  defaultRoll = 0.0 },
    glasses         = { fov = 5.0,  zPos = 0.7,   rotation = vector3(0.0, 0.0, 0.0),   dist = 2.5, defaultAngleH = 180.0,  defaultCamZ = 0.0,  defaultRoll = 0.0 },
    ears            = { fov = 20.0, zPos = 0.68,  rotation = vector3(0.0, 0.0, 0.0),   dist = 1.0, defaultAngleH = 180.9,  defaultCamZ = 0.0,  defaultRoll = 0.0 },
    watches         = { fov = 17.8, zPos = -0.19, rotation = vector3(0.0, 0.0, 275.0), dist = 1.0, defaultAngleH = -85.0,  defaultCamZ = 0.45, defaultRoll = 0.0 },
    bracelets       = { fov = 21.7, zPos = -0.19, rotation = vector3(0.0, 0.0, 0.0),   dist = 1.0, defaultAngleH = -275.6, defaultCamZ = 0.5,  defaultRoll = 0.0 },
    vehicle         = { fov = 40.0, zPos = 0.81,  rotation = vector3(0.0, 0.0, 0.0),   dist = 8.0, defaultAngleH = 399.4,  defaultCamZ = 1.82, defaultRoll = 0.0 },
    object          = { fov = 35.0, zPos = 0.42,  rotation = vector3(0.0, 0.0, 0.0),   dist = 3.7, defaultAngleH = 211.8,  defaultCamZ = 0.83, defaultRoll = 0.0 },
    weapon          = { fov = 25.0, zPos = 0.0,   rotation = vector3(0.0, 0.0, 0.0),   dist = 1.6, defaultAngleH = 0.0,    defaultCamZ = 0.0,  defaultRoll = 0.0 },
}

-- Clothing Categories (componentId -> camera preset)
-- visibleComponents : component IDs that remain visible at drawable 0 (e.g. 0=head, 2=hair, 3=torso)
-- componentOverrides: override specific component drawables (e.g. {[3] = 15} sets torso to drawable 15)
-- previewDrawable   : drawable shown in preview mode (default: 0)
-- hideHead          : draw a chroma-key sphere over the head during capture (removed by bg removal)
Customize.Categories = {
    { componentId = 2,  label = 'Hair',          camera = 'hair',        visibleComponents = {0}, previewDrawable = 15 },
    { componentId = 1,  label = 'Mask',          camera = 'mask',        visibleComponents = {0, 2}, previewDrawable = 23 },
    { componentId = 3,  label = 'Arms / Gloves', camera = 'arms_gloves', visibleComponents = {}, hideHead = true },
    { componentId = 4,  label = 'Pants',         camera = 'legs',        visibleComponents = {} },
    { componentId = 5,  label = 'Bags',          camera = 'decals',      visibleComponents = {}, previewDrawable = 1, hideHead = true },
    { componentId = 6,  label = 'Shoes',         camera = 'shoes',       visibleComponents = {}, previewDrawable = 1 },
    { componentId = 7,  label = 'Accessories',   camera = 'accessories', visibleComponents = {0, 3}, componentOverrides = {[3] = 15}, hideHead = true },
    { componentId = 8,  label = 'Undershirt',    camera = 'tops',        visibleComponents = {}, hideHead = true },
    { componentId = 9,  label = 'Body Armor',    camera = 'body',        visibleComponents = {}, previewDrawable = 1, hideHead = true },
    { componentId = 10, label = 'Decals',        camera = 'decals',      visibleComponents = {3}, componentOverrides = {[3] = 15}, hideHead = true },
    { componentId = 11, label = 'Tops',          camera = 'tops',        visibleComponents = {}, hideHead = true },
}

-- Prop Categories (propId -> camera preset)
-- anim: optional animation played during capture (dict, name, flag)
Customize.PropCategories = {
    { propId = 0, label = 'Hats',      camera = 'hats',      visibleComponents = {0, 2} },
    { propId = 1, label = 'Glasses',   camera = 'glasses',   visibleComponents = {0, 2}, previewDrawable = 2 },
    { propId = 2, label = 'Ears',      camera = 'ears',      visibleComponents = {0, 2} },
    { propId = 6, label = 'Watches',   camera = 'watches',   visibleComponents = {3}, anim = { dict = 'anim@heists@ornate_bank@grab_cash', name = 'grab', flag = 49 } },
    { propId = 7, label = 'Bracelets', camera = 'bracelets', visibleComponents = {3}, anim = { dict = 'anim@heists@ornate_bank@grab_cash', name = 'grab', flag = 49 } },
}

-- Head Overlay Categories (overlayIndex -> camera preset)
-- Uses SetPedHeadOverlay / GetPedHeadOverlayNum natives
-- colorType: 1 = hair color (eyebrows, facial hair), 2 = makeup color (makeup, blush, lipstick)
-- colorId: overlay color index (1 = black)
Customize.OverlayCategories = {
    -- Face overlays
    { overlayIndex = 0,  label = 'Blemishes',          camera = 'face_overlay',  visibleComponents = {0, 2}, colorType = 1, colorId = 1 },
    { overlayIndex = 1,  label = 'Facial Hair',        camera = 'face_overlay',  visibleComponents = {0, 2}, colorType = 1, colorId = 1 },
    { overlayIndex = 2,  label = 'Eyebrows',           camera = 'face_overlay',  visibleComponents = {0, 2}, colorType = 1, colorId = 1 },
    { overlayIndex = 3,  label = 'Ageing',             camera = 'face_overlay',  visibleComponents = {0, 2}, colorType = 1, colorId = 1 },
    { overlayIndex = 4,  label = 'Makeup',             camera = 'face_overlay',  visibleComponents = {0, 2}, colorType = 2, colorId = 1 },
    { overlayIndex = 5,  label = 'Blush',              camera = 'face_overlay',  visibleComponents = {0, 2}, colorType = 2, colorId = 1 },
    { overlayIndex = 6,  label = 'Complexion',         camera = 'face_overlay',  visibleComponents = {0, 2}, colorType = 1, colorId = 1 },
    { overlayIndex = 7,  label = 'Sun Damage',         camera = 'face_overlay',  visibleComponents = {0, 2}, colorType = 1, colorId = 1 },
    { overlayIndex = 8,  label = 'Lipstick',           camera = 'face_overlay',  visibleComponents = {0, 2}, colorType = 2, colorId = 1 },
    { overlayIndex = 9,  label = 'Moles & Freckles',   camera = 'face_overlay',  visibleComponents = {0, 2}, colorType = 1, colorId = 1 },
    -- Body overlays
    { overlayIndex = 10, label = 'Chest Hair',         camera = 'chest_overlay', visibleComponents = {0, 2, 3}, componentOverrides = {[3] = 15}, colorType = 1, colorId = 1 },
    { overlayIndex = 11, label = 'Body Blemishes',     camera = 'chest_overlay', visibleComponents = {0, 2, 3}, componentOverrides = {[3] = 15}, colorType = 1, colorId = 1 },
}

-- Vehicle Categories
-- 'auto' = auto-detect all loaded vehicle models via GetAllVehicleModels()
-- Or use a manual list: { { model = 'adder', label = 'Adder' }, ... }
Customize.VehicleCategories = 'auto'

-- Object/Prop Categories (world objects)
-- Add or remove props as needed. Use /shotprop <model> to capture unlisted props.
Customize.ObjectCategories = {
    -- Furniture
    { model = 'prop_bench_01a',       label = 'Park Bench' },
    { model = 'prop_bench_05',        label = 'Wooden Bench' },
    { model = 'prop_table_01',        label = 'Folding Table' },
    { model = 'prop_table_03',        label = 'Picnic Table' },
    { model = 'prop_chair_01a',       label = 'Folding Chair' },
    { model = 'prop_chair_04a',       label = 'Office Chair' },
    { model = 'prop_skid_chair_01',   label = 'Plastic Chair' },
    { model = 'prop_couch_01',        label = 'Couch' },
    { model = 'prop_bed_01',          label = 'Bed' },
    -- Containers
    { model = 'prop_barrel_01a',      label = 'Barrel' },
    { model = 'prop_cs_cardbox_01',   label = 'Cardboard Box' },
    { model = 'prop_box_wood01a',     label = 'Wood Crate' },
    { model = 'prop_bin_01a',         label = 'Trash Bin' },
    { model = 'prop_dumpster_01a',    label = 'Dumpster' },
    { model = 'prop_sacktruck_02a',   label = 'Hand Truck' },
    -- Electronics
    { model = 'prop_laptop_01a',      label = 'Laptop' },
    { model = 'prop_tv_flat_01',      label = 'Flat TV' },
    { model = 'prop_monitor_02',      label = 'Monitor' },
    { model = 'prop_radio_01',        label = 'Radio' },
    { model = 'prop_cs_tablet',       label = 'Tablet' },
    -- Food & Drink
    { model = 'prop_food_bs_burger3', label = 'Burger' },
    { model = 'prop_food_cb_donuts',  label = 'Donuts' },
    { model = 'prop_cs_beer_bot_01',  label = 'Beer Bottle' },
    { model = 'ng_proc_sodacan_01a',  label = 'Soda Can' },
    { model = 'prop_pizza_box_01',    label = 'Pizza Box' },
    -- Nature
    { model = 'prop_plant_int_01a',   label = 'Plant' },
    { model = 'prop_pot_plant_01a',   label = 'Pot Plant' },
    { model = 'prop_bush_lrg_04b',    label = 'Large Bush' },
    { model = 'prop_rock_4_a',        label = 'Rock' },
    -- Industrial
    { model = 'prop_barrier_work01a', label = 'Road Barrier' },
    { model = 'prop_cone_01a',        label = 'Traffic Cone' },
    { model = 'prop_toolchest_05',    label = 'Tool Chest' },
    { model = 'prop_jerrycan_01a',    label = 'Jerry Can' },
    { model = 'prop_fire_exting_1a',  label = 'Fire Extinguisher' },
    -- Weapons & Misc
    { model = 'prop_cs_katana_01',    label = 'Katana' },
    { model = 'prop_tool_hammer',     label = 'Hammer' },
    { model = 'prop_tool_wrench',     label = 'Wrench' },
    { model = 'prop_golf_bag_01',     label = 'Golf Bag' },
    { model = 'prop_bball_01',        label = 'Basketball' },
    { model = 'prop_tennis_ball',     label = 'Tennis Ball' },
}

-- Weapon Categories
-- Weapon world models spawned via CreateWeaponObject, frozen mid-air in the
-- studio and shot in profile. Use /shotweapon <weapon_name> for unlisted ones.
-- category: grouping shown in the capture UI accordion.
Customize.WeaponCategories = {
    -- Melee
    { weapon = 'weapon_dagger',            label = 'Antique Dagger',       category = 'Melee' },
    { weapon = 'weapon_bat',               label = 'Baseball Bat',         category = 'Melee' },
    { weapon = 'weapon_bottle',            label = 'Broken Bottle',        category = 'Melee' },
    { weapon = 'weapon_crowbar',           label = 'Crowbar',              category = 'Melee' },
    { weapon = 'weapon_flashlight',        label = 'Flashlight',           category = 'Melee' },
    { weapon = 'weapon_golfclub',          label = 'Golf Club',            category = 'Melee' },
    { weapon = 'weapon_hammer',            label = 'Hammer',               category = 'Melee' },
    { weapon = 'weapon_hatchet',           label = 'Hatchet',              category = 'Melee' },
    { weapon = 'weapon_knuckle',           label = 'Brass Knuckles',       category = 'Melee' },
    { weapon = 'weapon_knife',             label = 'Knife',                category = 'Melee' },
    { weapon = 'weapon_machete',           label = 'Machete',              category = 'Melee' },
    { weapon = 'weapon_switchblade',       label = 'Switchblade',          category = 'Melee' },
    { weapon = 'weapon_nightstick',        label = 'Nightstick',           category = 'Melee' },
    { weapon = 'weapon_wrench',            label = 'Pipe Wrench',          category = 'Melee' },
    { weapon = 'weapon_battleaxe',         label = 'Battle Axe',           category = 'Melee' },
    { weapon = 'weapon_poolcue',           label = 'Pool Cue',             category = 'Melee' },
    { weapon = 'weapon_stone_hatchet',     label = 'Stone Hatchet',        category = 'Melee' },
    -- Handguns
    { weapon = 'weapon_pistol',            label = 'Pistol',               category = 'Handguns' },
    { weapon = 'weapon_pistol_mk2',        label = 'Pistol Mk II',         category = 'Handguns' },
    { weapon = 'weapon_combatpistol',      label = 'Combat Pistol',        category = 'Handguns' },
    { weapon = 'weapon_appistol',          label = 'AP Pistol',            category = 'Handguns' },
    { weapon = 'weapon_stungun',           label = 'Stun Gun',             category = 'Handguns' },
    { weapon = 'weapon_pistol50',          label = 'Pistol .50',           category = 'Handguns' },
    { weapon = 'weapon_snspistol',         label = 'SNS Pistol',           category = 'Handguns' },
    { weapon = 'weapon_snspistol_mk2',     label = 'SNS Pistol Mk II',     category = 'Handguns' },
    { weapon = 'weapon_heavypistol',       label = 'Heavy Pistol',         category = 'Handguns' },
    { weapon = 'weapon_vintagepistol',     label = 'Vintage Pistol',       category = 'Handguns' },
    { weapon = 'weapon_flaregun',          label = 'Flare Gun',            category = 'Handguns' },
    { weapon = 'weapon_marksmanpistol',    label = 'Marksman Pistol',      category = 'Handguns' },
    { weapon = 'weapon_revolver',          label = 'Heavy Revolver',       category = 'Handguns' },
    { weapon = 'weapon_revolver_mk2',      label = 'Heavy Revolver Mk II', category = 'Handguns' },
    { weapon = 'weapon_doubleaction',      label = 'Double Action Revolver', category = 'Handguns' },
    { weapon = 'weapon_ceramicpistol',     label = 'Ceramic Pistol',       category = 'Handguns' },
    { weapon = 'weapon_navyrevolver',      label = 'Navy Revolver',        category = 'Handguns' },
    { weapon = 'weapon_gadgetpistol',      label = 'Perico Pistol',        category = 'Handguns' },
    { weapon = 'weapon_pistolxm3',         label = 'WM 29 Pistol',         category = 'Handguns' },
    -- SMGs
    { weapon = 'weapon_microsmg',          label = 'Micro SMG',            category = 'SMGs' },
    { weapon = 'weapon_smg',               label = 'SMG',                  category = 'SMGs' },
    { weapon = 'weapon_smg_mk2',           label = 'SMG Mk II',            category = 'SMGs' },
    { weapon = 'weapon_assaultsmg',        label = 'Assault SMG',          category = 'SMGs' },
    { weapon = 'weapon_combatpdw',         label = 'Combat PDW',           category = 'SMGs' },
    { weapon = 'weapon_machinepistol',     label = 'Machine Pistol',       category = 'SMGs' },
    { weapon = 'weapon_minismg',           label = 'Mini SMG',             category = 'SMGs' },
    { weapon = 'weapon_tecpistol',         label = 'Tactical SMG',         category = 'SMGs' },
    -- Shotguns
    { weapon = 'weapon_pumpshotgun',       label = 'Pump Shotgun',         category = 'Shotguns' },
    { weapon = 'weapon_pumpshotgun_mk2',   label = 'Pump Shotgun Mk II',   category = 'Shotguns' },
    { weapon = 'weapon_sawnoffshotgun',    label = 'Sawed-Off Shotgun',    category = 'Shotguns' },
    { weapon = 'weapon_assaultshotgun',    label = 'Assault Shotgun',      category = 'Shotguns' },
    { weapon = 'weapon_bullpupshotgun',    label = 'Bullpup Shotgun',      category = 'Shotguns' },
    { weapon = 'weapon_musket',            label = 'Musket',               category = 'Shotguns' },
    { weapon = 'weapon_heavyshotgun',      label = 'Heavy Shotgun',        category = 'Shotguns' },
    { weapon = 'weapon_dbshotgun',         label = 'Double Barrel Shotgun', category = 'Shotguns' },
    { weapon = 'weapon_autoshotgun',       label = 'Sweeper Shotgun',      category = 'Shotguns' },
    { weapon = 'weapon_combatshotgun',     label = 'Combat Shotgun',       category = 'Shotguns' },
    -- Rifles
    { weapon = 'weapon_assaultrifle',      label = 'Assault Rifle',        category = 'Rifles' },
    { weapon = 'weapon_assaultrifle_mk2',  label = 'Assault Rifle Mk II',  category = 'Rifles' },
    { weapon = 'weapon_carbinerifle',      label = 'Carbine Rifle',        category = 'Rifles' },
    { weapon = 'weapon_carbinerifle_mk2',  label = 'Carbine Rifle Mk II',  category = 'Rifles' },
    { weapon = 'weapon_advancedrifle',     label = 'Advanced Rifle',       category = 'Rifles' },
    { weapon = 'weapon_specialcarbine',    label = 'Special Carbine',      category = 'Rifles' },
    { weapon = 'weapon_specialcarbine_mk2', label = 'Special Carbine Mk II', category = 'Rifles' },
    { weapon = 'weapon_bullpuprifle',      label = 'Bullpup Rifle',        category = 'Rifles' },
    { weapon = 'weapon_bullpuprifle_mk2',  label = 'Bullpup Rifle Mk II',  category = 'Rifles' },
    { weapon = 'weapon_compactrifle',      label = 'Compact Rifle',        category = 'Rifles' },
    { weapon = 'weapon_militaryrifle',     label = 'Military Rifle',       category = 'Rifles' },
    { weapon = 'weapon_heavyrifle',        label = 'Heavy Rifle',          category = 'Rifles' },
    { weapon = 'weapon_tacticalrifle',     label = 'Service Carbine',      category = 'Rifles' },
    { weapon = 'weapon_battlerifle',       label = 'Battle Rifle',         category = 'Rifles' },
    -- Machine Guns
    { weapon = 'weapon_mg',                label = 'MG',                   category = 'Machine Guns' },
    { weapon = 'weapon_combatmg',          label = 'Combat MG',            category = 'Machine Guns' },
    { weapon = 'weapon_combatmg_mk2',      label = 'Combat MG Mk II',      category = 'Machine Guns' },
    { weapon = 'weapon_gusenberg',         label = 'Gusenberg Sweeper',    category = 'Machine Guns' },
    -- Snipers
    { weapon = 'weapon_sniperrifle',       label = 'Sniper Rifle',         category = 'Snipers' },
    { weapon = 'weapon_heavysniper',       label = 'Heavy Sniper',         category = 'Snipers' },
    { weapon = 'weapon_heavysniper_mk2',   label = 'Heavy Sniper Mk II',   category = 'Snipers' },
    { weapon = 'weapon_marksmanrifle',     label = 'Marksman Rifle',       category = 'Snipers' },
    { weapon = 'weapon_marksmanrifle_mk2', label = 'Marksman Rifle Mk II', category = 'Snipers' },
    { weapon = 'weapon_precisionrifle',    label = 'Precision Rifle',      category = 'Snipers' },
    -- Heavy
    { weapon = 'weapon_rpg',               label = 'RPG',                  category = 'Heavy' },
    { weapon = 'weapon_grenadelauncher',   label = 'Grenade Launcher',     category = 'Heavy' },
    { weapon = 'weapon_minigun',           label = 'Minigun',              category = 'Heavy' },
    { weapon = 'weapon_firework',          label = 'Firework Launcher',    category = 'Heavy' },
    { weapon = 'weapon_railgun',           label = 'Railgun',              category = 'Heavy' },
    { weapon = 'weapon_hominglauncher',    label = 'Homing Launcher',      category = 'Heavy' },
    { weapon = 'weapon_compactlauncher',   label = 'Compact Grenade Launcher', category = 'Heavy' },
    { weapon = 'weapon_emplauncher',       label = 'Compact EMP Launcher', category = 'Heavy' },
    -- Thrown
    { weapon = 'weapon_grenade',           label = 'Grenade',              category = 'Thrown' },
    { weapon = 'weapon_bzgas',             label = 'BZ Gas',               category = 'Thrown' },
    { weapon = 'weapon_smokegrenade',      label = 'Tear Gas',             category = 'Thrown' },
    { weapon = 'weapon_flare',             label = 'Flare',                category = 'Thrown' },
    { weapon = 'weapon_molotov',           label = 'Molotov',              category = 'Thrown' },
    { weapon = 'weapon_stickybomb',        label = 'Sticky Bomb',          category = 'Thrown' },
    { weapon = 'weapon_proxmine',          label = 'Proximity Mine',       category = 'Thrown' },
    { weapon = 'weapon_pipebomb',          label = 'Pipe Bomb',            category = 'Thrown' },
    { weapon = 'weapon_snowball',          label = 'Snowball',             category = 'Thrown' },
    { weapon = 'weapon_ball',              label = 'Baseball',             category = 'Thrown' },
    -- Misc
    { weapon = 'weapon_petrolcan',         label = 'Jerry Can',            category = 'Misc' },
    { weapon = 'weapon_fireextinguisher',  label = 'Fire Extinguisher',    category = 'Misc' },
    { weapon = 'weapon_hazardcan',         label = 'Hazardous Jerry Can',  category = 'Misc' },
    { weapon = 'weapon_metaldetector',     label = 'Metal Detector',       category = 'Misc' },
}

-- Green Screen (Weapons) — small, weapon floats at studio height
Customize.WeaponGreenScreen = {
    width       = 8.0,
    depth       = 8.0,
    height      = 8.5,
    floorOffset = -3.0,
}

-- Green Screen (Vehicles) — larger for cars
Customize.VehicleGreenScreen = {
    width       = 30.0,
    depth       = 30.0,
    height      = 15.0,
    floorOffset = -3.0,
}

-- Green Screen (Objects)
Customize.ObjectGreenScreen = {
    width       = 12.0,
    depth       = 12.0,
    height      = 10.0,
    floorOffset = -3.0,
}

-- Studio Lights (Vehicles) — wider range
Customize.VehicleStudioLights = {
    { offset = vector3(0.0, 8.0, 3.0),   range = 20.0, intensity = 4.0 },
    { offset = vector3(-8.0, 0.0, 3.0),  range = 15.0, intensity = 3.0 },
    { offset = vector3(8.0, 0.0, 3.0),   range = 15.0, intensity = 3.0 },
    { offset = vector3(0.0, -5.0, 3.0),  range = 12.0, intensity = 2.5 },
    { offset = vector3(0.0, 0.0, 8.0),   range = 18.0, intensity = 3.5 },
}
