module dressup_game
{
    export class PartConfig { path:string[]; exclude:string[]; allowHide:boolean; }

    export class Config
    {
        /**
         * Bindings for link buttons.
         * Each screen is recursively scanned for links.
         * If object's name is present in this map, button with navigation action is created
         * */
        static links: { [id:string]: string} =
        {
            'small_logo': 'http://girlieroom.com/?EDs309',
            'btn_more_seasons': 'http://girlieroom.com/?EDs309',
            'btn_free_games': 'http://girlieroom.com/freegames/page1/?EDs309',
            'btn_fb': 'http://facebook.com/EmilyDiary',
        };

        // Generated code!
        // generated from config.xml
        // config.xml.rb
        static parts: { [id:string]: PartConfig } =
        {
            //{BEGIN}
            'btn_m1_opt1': { 'path': ['model_1/opt_1'], 'exclude': [], 'allowHide': false },
            'btn_m1_opt2': { 'path': ['model_1/opt_2'], 'exclude': ['model_1/opt_3', 'model_1/opt_4'], 'allowHide': true },
            'btn_m1_opt3': { 'path': ['model_1/opt_3'], 'exclude': ['model_1/opt_2'], 'allowHide': true },
            'btn_m1_opt4': { 'path': ['model_1/opt_4'], 'exclude': ['model_1/opt_2'], 'allowHide': true },
            'btn_m1_opt5': { 'path': ['model_1/opt_5'], 'exclude': [], 'allowHide': true },
            'btn_m1_opt6': { 'path': ['model_1/opt_6'], 'exclude': [], 'allowHide': true },
            'btn_m1_opt7': { 'path': ['model_1/opt_7'], 'exclude': [], 'allowHide': true },
            'btn_m1_opt8': { 'path': ['model_1/opt_8'], 'exclude': [], 'allowHide': true },
            'btn_m1_opt9': { 'path': ['model_1/opt_9'], 'exclude': [], 'allowHide': true },
            'btn_m1_opt10': { 'path': ['model_1/opt_10'], 'exclude': [], 'allowHide': true },
            'btn_m1_opt11': { 'path': ['model_1/opt_11'], 'exclude': [], 'allowHide': true },
            'btn_m1_opt12': { 'path': ['model_1/opt_12'], 'exclude': [], 'allowHide': true },
            'btn_m1_opt13': { 'path': ['model_1/opt_13'], 'exclude': [], 'allowHide': true },
            'btn_m1_opt14': { 'path': ['model_1/opt_14'], 'exclude': [], 'allowHide': true },
            'btn_m1_opt15': { 'path': ['model_1/opt_15'], 'exclude': [], 'allowHide': true },
            
            'btn_m2_opt1': { 'path': ['model_2/opt_1'], 'exclude': [], 'allowHide': false },
            'btn_m2_opt2': { 'path': ['model_2/opt_2'], 'exclude': ['model_2/opt_3', 'model_2/opt_4'], 'allowHide': true },
            'btn_m2_opt3': { 'path': ['model_2/opt_3'], 'exclude': ['model_2/opt_2'], 'allowHide': true },
            'btn_m2_opt4': { 'path': ['model_2/opt_4'], 'exclude': ['model_2/opt_2'], 'allowHide': true },
            'btn_m2_opt5': { 'path': ['model_2/opt_5'], 'exclude': [], 'allowHide': true },
            'btn_m2_opt6': { 'path': ['model_2/opt_6'], 'exclude': [], 'allowHide': true },
            'btn_m2_opt7': { 'path': ['model_2/opt_7'], 'exclude': [], 'allowHide': true },
            'btn_m2_opt8': { 'path': ['model_2/opt_8'], 'exclude': [], 'allowHide': true },
            'btn_m2_opt9': { 'path': ['model_2/opt_9'], 'exclude': [], 'allowHide': true },
            'btn_m2_opt10': { 'path': ['model_2/opt_10'], 'exclude': [], 'allowHide': true },
            'btn_m2_opt11': { 'path': ['model_2/opt_11'], 'exclude': [], 'allowHide': true },
            'btn_m2_opt12': { 'path': ['model_2/opt_12'], 'exclude': [], 'allowHide': true },
            'btn_m2_opt13': { 'path': ['model_2/opt_13'], 'exclude': [], 'allowHide': true },
            'btn_m2_opt14': { 'path': ['model_2/opt_14'], 'exclude': [], 'allowHide': true },
            'btn_m2_opt15': { 'path': ['model_2/opt_15'], 'exclude': [], 'allowHide': true },
            
            'btn_m3_opt1': { 'path': ['model_3/opt_1'], 'exclude': [], 'allowHide': false },
            'btn_m3_opt2': { 'path': ['model_3/opt_2'], 'exclude': [], 'allowHide': true },
            'btn_m3_opt3': { 'path': ['model_3/opt_3'], 'exclude': [], 'allowHide': true },
            'btn_m3_opt4': { 'path': ['model_3/opt_4'], 'exclude': [], 'allowHide': true },
            'btn_m3_opt5': { 'path': ['model_3/opt_5'], 'exclude': [], 'allowHide': true },
            'btn_m3_opt6': { 'path': ['model_3/opt_6'], 'exclude': [], 'allowHide': true },
            'btn_m3_opt7': { 'path': ['model_3/opt_7'], 'exclude': [], 'allowHide': true },
            'btn_m3_opt8': { 'path': ['model_3/opt_8'], 'exclude': [], 'allowHide': true },
            'btn_m3_opt9': { 'path': ['model_3/opt_9'], 'exclude': [], 'allowHide': true },
            'btn_m3_opt10': { 'path': ['model_3/opt_10'], 'exclude': [], 'allowHide': true },
            'btn_m3_opt11': { 'path': ['model_3/opt_11'], 'exclude': [], 'allowHide': true },
            'btn_m3_opt12': { 'path': ['model_3/opt_12'], 'exclude': [], 'allowHide': true },
            'btn_m3_opt13': { 'path': ['model_3/opt_13'], 'exclude': [], 'allowHide': true },
            'btn_m3_opt14': { 'path': ['model_3/opt_14'], 'exclude': [], 'allowHide': true },
            'btn_m3_opt15': { 'path': ['model_3/opt_15'], 'exclude': [], 'allowHide': true },
            //{END}
        };
    }
}

