/* LevelConfig filed desic: (4 fileds)
	id: string
	headName: string
	exp: int
	cannonIconName: string
*/

var filed_data = {
	key_1: ["1", "photo_hetun", 0, "icon_weapon_1", ], 
	key_2: ["2", "photo_hetun", 200, "icon_weapon_5", ], 
	key_3: ["3", "photo_hetun", 1000, "icon_weapon_10", ], 
	key_4: ["4", "photo_hetun", 2000, "icon_weapon_15", ], 
	key_5: ["5", "photo_douyu", 3000, "icon_weapon_30", ], 
	key_6: ["6", "photo_douyu", 4000, "icon_weapon_40", ], 
	key_7: ["7", "photo_douyu", 5000, "icon_weapon_50", ], 
	key_8: ["8", "photo_douyu", 6000, "icon_weapon_60_1", ], 
	key_9: ["9", "photo_dianman", 7000, "icon_weapon_70", ], 
	key_10: ["10", "photo_dianman", 8000, "icon_weapon_10", ], 
	total_count: 10
};

function get_record(id) {
	var key = "key_" + id;
	var record_array = filed_data[key];
	if(!record_array) {
		 return null;
	}

	var record = {
		id: record_array[0],
		headName: record_array[1],
		exp: record_array[2],
		cannonIconName: record_array[3],
	}; 

	return record; 
}

var LevelConfig = { 
	filed_data_array: filed_data, 
	get_record: get_record, 
}; 

module.exports = LevelConfig;