const players = {
    0: {name: 'Jimmy Garoppolo', team: '0', position: 'QB', number: 10, type: '2', apiId: 16041},
    1: {name: 'Trey Lance', team: '0', position: 'QB', number: 5, type: '1', apiId: 22493},
    2: {name: 'Elijah Mitchell', team: '0', position: 'RB', number: 25, type: '1', apiId: 22535},
    3: {name: 'Trey Sermon', team: '0', position: 'RB', number: 28, type: '1', apiId: 21801},
    4: {name: 'Brandon Aiyuk', team: '0', position: 'WR', number: 11, type: '1', apiId: 21747},
    5: {name: 'Deebo Samuel', team: '0', position: 'WR', number: 19, type: '1', apiId: 20932},
    6: {name: 'Mohamed  Sanu', team: '0', position: 'WR', number: 6, type: '1', apiId: 13878},
    7: {name: 'George Kittle', team: '0', position: 'TE', number: 85, type: '2', apiId: 19063},
    8: {name: 'Justin Fields', team: '1', position: 'QB', number: 1, type: '1', apiId: 22492},
    9: {name: 'David Montgomery', team: '1', position: 'RB', number: 32, type: '1', apiId: 20882},
    10: {name: 'Damien Williams', team: '1', position: 'RB', number: 8, type: '1', apiId: 16031},
    11: {name: 'Allen Robinson', team: '1', position: 'WR', number: 12, type: '1', apiId: 16263},
    12: {name: 'Darnell Mooney', team: '1', position: 'WR', number: 11, type: '1', apiId: 21961},
    13: {name: 'Breshad Perriman', team: '6', position: 'WR', number: 19, type: '1', apiId: 16787},
    14: {name: 'Andy Dalton', team: '1', position: 'QB', number: 14, type: '2', apiId: 12841},
    15: {name: 'Cole Kmet', team: '1', position: 'TE', number: 85, type: '2', apiId: 21772},
    16: {name: 'Joe Burrow', team: '2', position: 'QB', number: 9, type: '2', apiId: 21693},
    17: {name: 'Joe Mixon', team: '2', position: 'RB', number: 28, type: '1', apiId: 18858},
    18: {name: 'Samaje Perine', team: '2', position: 'RB', number: 34, type: '1', apiId: 18993},
    19: {name: 'Ja\'Marr Chase', team: '2', position: 'WR', number: 1, type: '1', apiId: 22564},
    20: {name: 'Tyler Boyd', team: '2', position: 'WR', number: 83, type: '1', apiId: 17986},
    21: {name: 'Tee Higgins', team: '2', position: 'WR', number: 85, type: '1', apiId: 21690},
    22: {name: 'CJ Uzomah', team: '2', position: 'TE', number: 87, type: '1', apiId: 16917},
    23: {name: 'Josh Allen', team: '3', position: 'QB', number: 17, type: '2', apiId: 19801},
    24: {name: 'Devin Singletary', team: '3', position: 'RB', number: 26, type: '1', apiId: 20941},
    25: {name: 'Zack Moss', team: '3', position: 'RB', number: 20, type: '1', apiId: 21784},
    26: {name: 'Stefon Diggs', team: '3', position: 'WR', number: 14, type: '1', apiId: 16906},
    27: {name: 'Emmanuel Sanders', team: '3', position: 'WR', number: 1, type: '1', apiId: 11063},
    28: {name: 'Cole Beasley', team: '3', position: 'WR', number: 11, type: '2', apiId: 14141},
    29: {name: 'Dawson Knox', team: '3', position: 'TE', number: 88, type: '2', apiId: 20850},
    30: {name: 'Teddy Bridgewater', team: '4', position: 'QB', number: 5, type: '1', apiId: 16497},
    31: {name: 'Melvin Gordon', team: '4', position: 'RB', number: 25, type: '1', apiId: 16776},
    32: {name: 'Javonte Williams', team: '4', position: 'RB', number: 33, type: '1', apiId: 22558},
    33: {name: 'KJ Hamler', team: '4', position: 'WR', number: 1, type: '1', apiId: 21759},
    34: {name: 'Courtland Sutton', team: '4', position: 'WR', number: 14, type: '1', apiId: 19800},
    35: {name: 'Kendall Hinton', team: '4', position: 'WR', number: 9, type: '1', apiId: 22213},
    36: {name: 'Noah Fant', team: '4', position: 'TE', number: 87, type: '1', apiId: 20753},
    37: {name: 'Baker Mayfield', team: '5', position: 'QB', number: 6, type: '2', apiId: 19790},
    38: {name: 'Nick Chubb', team: '5', position: 'RB', number: 24, type: '1', apiId: 19798},
    39: {name: 'Kareem Hunt', team: '5', position: 'RB', number: 27, type: '1', apiId: 18944},
    40: {name: 'Jarvis Landry', team: '5', position: 'WR', number: 80, type: '1', apiId: 16020},
    41: {name: 'Odell Beckham Jr', team: '23', position: 'WR', number: 13, type: '1', apiId: 16389},
    42: {name: 'Donovan Peoples-Jones', team: '5', position: 'WR', number: 11, type: '1', apiId: 21754},
    43: {name: 'Austin Hooper', team: '5', position: 'TE', number: 81, type: '1', apiId: 17963},
    44: {name: 'Tom Brady', team: '6', position: 'QB', number: 12, type: '2', apiId: 4314},
    45: {name: 'Ronald Jones II', team: '6', position: 'RB', number: 27, type: '1', apiId: 19861},
    46: {name: 'Leonard Fournette', team: '6', position: 'RB', number: 7, type: '1', apiId: 18803},
    47: {name: 'Mike Evans', team: '6', position: 'WR', number: 13, type: '1', apiId: 16597},
    48: {name: 'Chris Godwin', team: '6', position: 'WR', number: 14, type: '1', apiId: 18880},
    49: {name: 'Antonio Brown', team: '6', position: 'WR', number: 81, type: '1', apiId: 11056},
    50: {name: 'Rob Gronkowski', team: '6', position: 'TE', number: 87, type: '2', apiId: 10974},
    51: {name: 'Kyler Murray', team: '7', position: 'QB', number: 1, type: '1', apiId: 20889},
    52: {name: 'Chase Edmonds', team: '7', position: 'RB', number: 2, type: '1', apiId: 19919},
    53: {name: 'James Conner', team: '7', position: 'RB', number: 6, type: '1', apiId: 18983},
    54: {name: 'AJ Green', team: '7', position: 'WR', number: 18, type: '1', apiId: 12845},
    55: {name: 'DeAndre Hopkins', team: '7', position: 'WR', number: 10, type: '1', apiId: 14986},
    56: {name: 'Christian Kirk', team: '7', position: 'WR', number: 13, type: '1', apiId: 19815},
    57: {name: 'Maxx Williams', team: '7', position: 'TE', number: 87, type: '2', apiId: 16816},
    58: {name: 'Justin Herbert', team: '8', position: 'QB', number: 10, type: '2', apiId: 21681},
    59: {name: 'Austin Ekeler', team: '8', position: 'RB', number: 30, type: '1', apiId: 19562},
    60: {name: 'Mike Williams', team: '8', position: 'WR', number: 81, type: '1', apiId: 18914},
    61: {name: 'Keenan Allen', team: '8', position: 'WR', number: 13, type: '1', apiId: 15076},
    62: {name: 'Jared Cook', team: '8', position: 'TE', number: 87, type: '1', apiId: 8534},
    63: {name: 'Pat Mahomes', team: '9', position: 'QB', number: 15, type: '1', apiId: 18890},
    64: {name: 'Clyde Edwards-Helaire', team: '9', position: 'RB', number: 25, type: '1', apiId: 21769},
    65: {name: 'Darrel Williams', team: '9', position: 'RB', number: 31, type: '1', apiId: 20500},
    66: {name: 'Tyreek Hill', team: '9', position: 'WR', number: 10, type: '1', apiId: 18082},
    67: {name: 'Mecole Hardman', team: '9', position: 'WR', number: 17, type: '1', apiId: 20788},
    68: {name: 'Travis Kelce', team: '9', position: 'TE', number: 87, type: '2', apiId: 15048},
    69: {name: 'Sam Ehlinger', team: '10', position: 'QB', number: 4, type: '2', apiId: 21815},
    70: {name: 'Carson Wentz', team: '10', position: 'QB', number: 2, type: '2', apiId: 17920},
    71: {name: 'Jonathan Taylor', team: '10', position: 'RB', number: 28, type: '1', apiId: 21682},
    72: {name: 'Michael Pittman Jr', team: '10', position: 'WR', number: 11, type: '1', apiId: 21744},
    73: {name: 'Zach Pascal', team: '10', position: 'WR', number: 14, type: '1', apiId: 19172},
    74: {name: 'Mike Strachan', team: '10', position: 'WR', number: 17, type: '1', apiId: 22620},
    75: {name: 'Nyheim Hines', team: '10', position: 'RB', number: 21, type: '1', apiId: 19912},
    76: {name: 'Jack Doyle', team: '10', position: 'TE', number: 84, type: '2', apiId: 15602},
    77: {name: 'Dak Prescott', team: '11', position: 'QB', number: 4, type: '1', apiId: 18055},
    78: {name: 'Ezekiel Elliott', team: '11', position: 'RB', number: 21, type: '1', apiId: 17923},
    79: {name: 'Amari Cooper', team: '11', position: 'WR', number: 19, type: '1', apiId: 16765},
    80: {name: 'CeeDee Lamb', team: '11', position: 'WR', number: 88, type: '1', apiId: 21679},
    81: {name: 'Blake Jarwin', team: '11', position: 'TE', number: 89, type: '2', apiId: 19457},
    82: {name: 'Tony Pollard', team: '11', position: 'RB', number: 20, type: '1', apiId: 20912},
    83: {name: 'Tua Tagovailoa', team: '12', position: 'QB', number: 1, type: '1', apiId: 21677},
    84: {name: 'Myles Gaskin', team: '12', position: 'RB', number: 37, type: '1', apiId: 20768},
    85: {name: 'DeVante Parker', team: '12', position: 'WR', number: 11, type: '1', apiId: 16775},
    86: {name: 'Mack Hollins', team: '12', position: 'WR', number: 86, type: '1', apiId: 19023},
    87: {name: 'Jaylen Waddle', team: '12', position: 'WR', number: 17, type: '1', apiId: 22598},
    88: {name: 'Mike Gesicki', team: '12', position: 'TE', number: 88, type: '2', apiId: 19853},
    89: {name: 'Jalen Hurts', team: '13', position: 'QB', number: 1, type: '1', apiId: 21831},
    90: {name: 'Miles Sanders', team: '13', position: 'RB', number: 26, type: '1', apiId: 20933},
    91: {name: 'DeVonta Smith', team: '13', position: 'WR', number: 6, type: '1', apiId: 21687},
    92: {name: 'Jalen Reagor', team: '13', position: 'WR', number: 18, type: '1', apiId: 21686},
    93: {name: 'Zach Ertz', team: '7', position: 'TE', number: 86, type: '2', apiId: 14856},
    94: {name: 'Matt Ryan', team: '14', position: 'QB', number: 2, type: '2', apiId: 732},
    95: {name: 'Mike Davis', team: '14', position: 'RB', number: 28, type: '1', apiId: 16887},
    96: {name: 'Calvin Ridley', team: '14', position: 'WR', number: 18, type: '1', apiId: 19802},
    97: {name: 'Russell Gage', team: '14', position: 'WR', number: 14, type: '1', apiId: 20006},
    98: {name: 'Kyle Pitts', team: '14', position: 'TE', number: 8, type: '1', apiId: 22508},
    99: {name: 'Daniel Jones', team: '15', position: 'QB', number: 8, type: '2', apiId: 20841},
    100: {name: 'Saquon Barkley', team: '15', position: 'RB', number: 26, type: '1', apiId: 19766},
    101: {name: 'Kenny Golladay', team: '15', position: 'WR', number: 19, type: '1', apiId: 18977},
    102: {name: 'Sterling Shepard', team: '15', position: 'WR', number: 3, type: '1', apiId: 17961},
    103: {name: 'Evan Engram', team: '15', position: 'TE', number: 88, type: '1', apiId: 18912},
    104: {name: 'Trevor Lawrence', team: '16', position: 'QB', number: 16, type: '2', apiId: 22490},
    105: {name: 'James Robinson', team: '16', position: 'RB', number: 25, type: '1', apiId: 21970},
    106: {name: 'DJ Chark', team: '16', position: 'WR', number: 17, type: '1', apiId: 19816},
    107: {name: 'Lavishka Shenault Jr', team: '16', position: 'WR', number: 10, type: '1', apiId: 21697},
    108: {name: 'Marvin Jones', team: '16', position: 'WR', number: 11, type: '1', apiId: 13870},
    109: {name: 'Zach Wilson', team: '17', position: 'QB', number: 2, type: '2', apiId: 22495},
    110: {name: 'Tevin Coleman', team: '17', position: 'RB', number: 23, type: '1', apiId: 16834},
    111: {name: 'Corey Davis', team: '17', position: 'WR', number: 84, type: '1', apiId: 18879},
    112: {name: 'Jamison Crowder', team: '17', position: 'WR', number: 82, type: '1', apiId: 16866},
    113: {name: 'Ryan Griffin', team: '17', position: 'TE', number: 86, type: '2', apiId: 14985},
    114: {name: 'Jared Goff', team: '18', position: 'QB', number: 16, type: '2', apiId: 17922},
    115: {name: 'D\'Andre Swift', team: '18', position: 'RB', number: 32, type: '1', apiId: 21684},
    116: {name: 'Quintez Cephus', team: '18', position: 'WR', number: 87, type: '1', apiId: 21729},
    117: {name: 'Kalif Raymond', team: '18', position: 'WR', number: 11, type: '1', apiId: 18422},
    118: {name: 'TJ Hockenson', team: '18', position: 'TE', number: 88, type: '2', apiId: 20805},
    119: {name: 'Aaron Rodgers', team: '19', position: 'QB', number: 12, type: '2', apiId: 2593},
    120: {name: 'Aaron Jones', team: '19', position: 'RB', number: 33, type: '1', apiId: 19045},
    121: {name: 'Davante Adams', team: '19', position: 'WR', number: 17, type: '1', apiId: 16470},
    122: {name: 'Marquez Valder-Scantling', team: '19', position: 'WR', number: 83, type: '1', apiId: 19976},
    123: {name: 'Randall Cobb', team: '19', position: 'WR', number: 18, type: '1', apiId: 13227},
    124: {name: 'Robert Tonyan Jr', team: '19', position: 'TE', number: 85, type: '2', apiId: 19491},
    125: {name: 'Sam Darnold', team: '20', position: 'QB', number: 14, type: '2', apiId: 19812},
    126: {name: 'Christian McCaffrey', team: '20', position: 'RB', number: 22, type: '2', apiId: 18877},
    127: {name: 'Chubba Hubbard', team: '20', position: 'RB', number: 30, type: '1', apiId: 21691},
    128: {name: 'DJ Moore', team: '20', position: 'WR', number: 2, type: '1', apiId: 19844},
    129: {name: 'Robby Anderson', team: '20', position: 'WR', number: 11, type: '1', apiId: 18187},
    130: {name: 'Ian Thomas', team: '20', position: 'TE', number: 80, type: '1', apiId: 19910},
    131: {name: 'Mac Jones', team: '21', position: 'QB', number: 10, type: '2', apiId: 22496},
    132: {name: 'Damien Harris', team: '21', position: 'RB', number: 37, type: '1', apiId: 20790},
    133: {name: 'James White', team: '21', position: 'RB', number: 28, type: '1', apiId: 16056},
    134: {name: 'Nelson Agholor', team: '21', position: 'WR', number: 15, type: '1', apiId: 16781},
    135: {name: 'Jakobi Meyers', team: '21', position: 'WR', number: 16, type: '1', apiId: 20876},
    136: {name: 'Jonnu Smith', team: '21', position: 'TE', number: 81, type: '1', apiId: 18990},
    137: {name: 'Derek Carr', team: '22', position: 'QB', number: 4, type: '2', apiId: 16311},
    138: {name: 'Josh Jacobs', team: '22', position: 'RB', number: 28, type: '1', apiId: 20824},
    139: {name: 'Kenyan Drake', team: '22', position: 'RB', number: 23, type: '1', apiId: 18003},
    140: {name: 'Henry Ruggs III', team: '22', position: 'WR', number: 11, type: '1', apiId: 21694},
    141: {name: 'Bryan Edwards', team: '22', position: 'WR', number: 89, type: '1', apiId: 21736},
    142: {name: 'Hunter Renfrow', team: '22', position: 'WR', number: 13, type: '2', apiId: 20924},
    143: {name: 'Darren Waller', team: '22', position: 'TE', number: 83, type: '1', apiId: 16964},
    144: {name: 'Matt Stafford', team: '23', position: 'QB', number: 9, type: '2', apiId: 9038},
    145: {name: 'Robert Woods', team: '23', position: 'WR', number: 2, type: '1', apiId: 14871},
    146: {name: 'Cooper Kupp', team: '23', position: 'WR', number: 10, type: '2', apiId: 18882},
    147: {name: 'Sony Michel', team: '23', position: 'RB', number: 25, type: '1', apiId: 19828},
    148: {name: 'Tyler Higbee', team: '23', position: 'TE', number: 89, type: '2', apiId: 18032},
    149: {name: 'Lamar Jackson', team: '24', position: 'QB', number: 8, type: '1', apiId: 19781},
    150: {name: 'Ty\'Son Williams', team: '24', position: 'RB', number: 34, type: '1', apiId: 22126},
    151: {name: 'Sammy Watkins', team: '24', position: 'WR', number: 14, type: '1', apiId: 16003},
    152: {name: 'Marquise Brown', team: '24', position: 'WR', number: 5, type: '1', apiId: 21045},
    153: {name: 'Mark Andrews', team: '24', position: 'TE', number: 89, type: '2', apiId: 19803},
    154: {name: 'Taylor Heinicke', team: '25', position: 'QB', number: 4, type: '2', apiId: 17179},
    155: {name: 'Antonio Gibson', team: '25', position: 'RB', number: 24, type: '1', apiId: 21861},
    156: {name: 'Terry McLaurin', team: '25', position: 'WR', number: 17, type: '1', apiId: 20873},
    157: {name: 'Adam Humphries', team: '25', position: 'WR', number: 13, type: '2', apiId: 17290},
    158: {name: 'Logan Thomas', team: '25', position: 'TE', number: 82, type: '1', apiId: 16656},
    159: {name: 'Jameis Winston', team: '26', position: 'QB', number: 2, type: '1', apiId: 16762},
    160: {name: 'Alvin Kamara', team: '26', position: 'RB', number: 41, type: '1', apiId: 18878},
    161: {name: 'Marquez Callaway', team: '26', position: 'WR', number: 1, type: '1', apiId: 21750},
    162: {name: 'Deonte Harris', team: '26', position: 'WR', number: 11, type: '1', apiId: 21163},
    163: {name: 'Adam Trautman', team: '26', position: 'TE', number: 82, type: '2', apiId: 21786},
    164: {name: 'Russell Wilson', team: '27', position: 'QB', number: 3, type: '1', apiId: 14536},
    165: {name: 'Chris Carson', team: '27', position: 'RB', number: 32, type: '1', apiId: 19119},
    166: {name: 'DK Metcalf', team: '27', position: 'WR', number: 14, type: '1', apiId: 20875},
    167: {name: 'Tyler Lockett', team: '27', position: 'WR', number: 16, type: '1', apiId: 16830},
    168: {name: 'Gerald Everett', team: '27', position: 'TE', number: 81, type: '1', apiId: 18935},
    169: {name: 'Ben Roethlisberger', team: '28', position: 'QB', number: 7, type: '2', apiId: 3807},
    170: {name: 'Najee Harris', team: '28', position: 'RB', number: 22, type: '1', apiId: 21768},
    171: {name: 'JuJu Smith-Schuster', team: '28', position: 'WR', number: 19, type: '1', apiId: 18883},
    172: {name: 'Chase Claypool', team: '28', position: 'WR', number: 11, type: '1', apiId: 21752},
    173: {name: 'Diontae Johnson', team: '28', position: 'WR', number: 18, type: '1', apiId: 21077},
    174: {name: 'Eric Ebron', team: '28', position: 'TE', number: 85, type: '1', apiId: 16451},
    175: {name: 'Davis Mills', team: '29', position: 'QB', number: 10, type: '2', apiId: 22505},
    176: {name: 'Mark Ingram', team: '26', position: 'RB', number: 2, type: '1', apiId: 13337},
    177: {name: 'Brandin Cooks', team: '29', position: 'WR', number: 13, type: '1', apiId: 16568},
    178: {name: 'Chris Conley', team: '29', position: 'WR', number: 18, type: '1', apiId: 16837},
    179: {name: 'Pharaoh Brown', team: '29', position: 'TE', number: 85, type: '1', apiId: 19304},
    180: {name: 'Ryan Tannehill', team: '30', position: 'QB', number: 17, type: '2', apiId: 13799},
    181: {name: 'Derrick Henry', team: '30', position: 'RB', number: 22, type: '1', apiId: 17959},
    182: {name: 'Julio Jones', team: '30', position: 'WR', number: 2, type: '1', apiId: 13291},
    183: {name: 'AJ Brown', team: '30', position: 'WR', number: 11, type: '1', apiId: 21042},
    184: {name: 'Geoff Swaim', team: '30', position: 'TE', number: 87, type: '2', apiId: 17005},
    185: {name: 'Kirk Cousins', team: '31', position: 'QB', number: 8, type: '2', apiId: 14252},
    186: {name: 'Dalvin Cook', team: '31', position: 'RB', number: 33, type: '1', apiId: 18872},
    187: {name: 'Justin Jefferson', team: '31', position: 'WR', number: 18, type: '1', apiId: 21685},
    188: {name: 'Adam Thielen', team: '31', position: 'WR', number: 19, type: '2', apiId: 15534},
    189: {name: 'Chris Herndon', team: '31', position: 'TE', number: 89, type: '1', apiId: 19947},
    190: {name: 'Jordan Love', team: '19', position: 'QB', number: 12, type: '1', apiId: 21841},
    191: {name: 'Mike White', team: '17', position: 'QB', number: 12, type: '2', apiId: 19972},
    192: {name: 'Pat Freiermuth', team: '28', position: 'TE', number: 88, type: '2', apiId: 22507},
    193: {name: 'Adrian Peterson', team: '30', position: 'RB', number: 8, type: '1', apiId: 17959}
}

const teamNames = {
    0: '49ers',
    1: 'Bears',
    2: 'Bengals',
    3: 'Bills',
    4: 'Broncos',
    5: 'Browns',
    6: 'Buccaneers',
    7: 'Cardinals',
    8: 'Chargers',
    9: 'Chiefs',
    10: 'Colts',
    11: 'Cowboys',
    12: 'Dolphins',
    13: 'Eagles',
    14: 'Falcons',
    15: 'Giants',
    16: 'Jaguars ',
    17: 'Jets',
    18: 'Lions',
    19: 'Packers',
    20: 'Panthers',
    21: 'Patriots',
    22: 'Raiders',
    23: 'Rams',
    24: 'Ravens',
    25: 'Football Team',
    26: 'Saints',
    27: 'Seahawks',
    28: 'Steelers',
    29: 'Texans',
    30: 'Titans',
    31: 'Vikings'
}

export const getPlayerTeamById = (id) => {
    return players[id].team;
}

export const getPlayerNumberById = (id) => {
    return players[id].number;
}

export const getPlayerTypeById = (id) => {
    return players[id].type;
}

export const getPlayerNameById = (id) => {
    return players[id].name;
}

export const getPlayerPositionById = (id) => {
    return players[id].position;
}

export const getPlayerApiIdById = (id) => {
    return players[id].apiId;
}

export const getTeamName = (id) => {
    return teamNames[getPlayerTeamById(id)];
}