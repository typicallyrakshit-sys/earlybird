// ─── Data Definitions ───
const COMMITTEES = [
    {
        id: 'unga',
        name: 'UNGA',
        portfolios: [
            { id: '1', name: 'Afghanistan', status: 'available' },
            { id: '2', name: 'Albania', status: 'available' },
            { id: '3', name: 'Algeria', status: 'available' },
            { id: '4', name: 'Andorra', status: 'available' },
            { id: '5', name: 'Angola', status: 'available' },
            { id: '6', name: 'Antigua and Barbuda', status: 'available' },
            { id: '7', name: 'Argentina', status: 'available' },
            { id: '8', name: 'Armenia', status: 'available' },
            { id: '9', name: 'Australia', status: 'available' },
            { id: '10', name: 'Austria', status: 'available' },
            { id: '11', name: 'Azerbaijan', status: 'available' },
            { id: '12', name: 'Bahamas', status: 'available' },
            { id: '13', name: 'Bahrain', status: 'available' },
            { id: '14', name: 'Bangladesh', status: 'available' },
            { id: '15', name: 'Barbados', status: 'available' },
            { id: '16', name: 'Belarus', status: 'available' },
            { id: '17', name: 'Belgium', status: 'available' },
            { id: '18', name: 'Belize', status: 'available' },
            { id: '19', name: 'Benin', status: 'available' },
            { id: '20', name: 'Bhutan', status: 'available' },
            { id: '21', name: 'Bolivia', status: 'available' },
            { id: '22', name: 'Bosnia and Herzegovina', status: 'available' },
            { id: '23', name: 'Botswana', status: 'available' },
            { id: '24', name: 'Brazil', status: 'available' },
            { id: '25', name: 'Brunei', status: 'available' },
            { id: '26', name: 'Bulgaria', status: 'available' },
            { id: '27', name: 'Burkina Faso', status: 'available' },
            { id: '28', name: 'Burundi', status: 'available' },
            { id: '29', name: 'Cabo Verde', status: 'available' },
            { id: '30', name: 'Cambodia', status: 'available' },
            { id: '31', name: 'Cameroon', status: 'available' },
            { id: '32', name: 'Canada', status: 'available' },
            { id: '33', name: 'Central African Republic', status: 'available' },
            { id: '34', name: 'Chad', status: 'available' },
            { id: '35', name: 'Chile', status: 'available' },
            { id: '36', name: 'China', status: 'available' },
            { id: '37', name: 'Colombia', status: 'available' },
            { id: '38', name: 'Comoros', status: 'available' },
            { id: '39', name: 'Congo', status: 'available' },
            { id: '40', name: 'Costa Rica', status: 'available' },
            { id: '41', name: 'Côte d’Ivoire', status: 'available' },
            { id: '42', name: 'Croatia', status: 'available' },
            { id: '43', name: 'Cuba', status: 'available' },
            { id: '44', name: 'Cyprus', status: 'available' },
            { id: '45', name: 'Czechia', status: 'available' },
            { id: '46', name: 'Democratic Republic of the Congo', status: 'available' },
            { id: '47', name: 'Denmark', status: 'available' },
            { id: '48', name: 'Djibouti', status: 'available' },
            { id: '49', name: 'Dominica', status: 'available' },
            { id: '50', name: 'Dominican Republic', status: 'available' },
            { id: '51', name: 'Ecuador', status: 'available' },
            { id: '52', name: 'Egypt', status: 'available' },
            { id: '53', name: 'El Salvador', status: 'available' },
            { id: '54', name: 'Equatorial Guinea', status: 'available' },
            { id: '55', name: 'Eritrea', status: 'available' },
            { id: '56', name: 'Estonia', status: 'available' },
            { id: '57', name: 'Eswatini', status: 'available' },
            { id: '58', name: 'Ethiopia', status: 'available' },
            { id: '59', name: 'Fiji', status: 'available' },
            { id: '60', name: 'Finland', status: 'available' },
            { id: '61', name: 'France', status: 'available' },
            { id: '62', name: 'Gabon', status: 'available' },
            { id: '63', name: 'Gambia', status: 'available' },
            { id: '64', name: 'Georgia', status: 'available' },
            { id: '65', name: 'Germany', status: 'available' },
            { id: '66', name: 'Ghana', status: 'available' },
            { id: '67', name: 'Greece', status: 'available' },
            { id: '68', name: 'Grenada', status: 'available' },
            { id: '69', name: 'Guatemala', status: 'available' },
            { id: '70', name: 'Guinea', status: 'available' },
            { id: '71', name: 'Guinea-Bissau', status: 'available' },
            { id: '72', name: 'Guyana', status: 'available' },
            { id: '73', name: 'Haiti', status: 'available' },
            { id: '74', name: 'Honduras', status: 'available' },
            { id: '75', name: 'Hungary', status: 'available' },
            { id: '76', name: 'Iceland', status: 'available' },
            { id: '77', name: 'India', status: 'available' },
            { id: '78', name: 'Indonesia', status: 'available' },
            { id: '79', name: 'Iran', status: 'available' },
            { id: '80', name: 'Iraq', status: 'available' },
            { id: '81', name: 'Ireland', status: 'available' },
            { id: '82', name: 'Israel', status: 'available' },
            { id: '83', name: 'Italy', status: 'available' },
            { id: '84', name: 'Jamaica', status: 'available' },
            { id: '85', name: 'Japan', status: 'available' },
            { id: '86', name: 'Jordan', status: 'available' },
            { id: '87', name: 'Kazakhstan', status: 'available' },
            { id: '88', name: 'Kenya', status: 'available' },
            { id: '89', name: 'Kiribati', status: 'available' },
            { id: '90', name: 'Kuwait', status: 'available' },
            { id: '91', name: 'Kyrgyzstan', status: 'available' },
            { id: '92', name: 'Laos', status: 'available' },
            { id: '93', name: 'Latvia', status: 'available' },
            { id: '94', name: 'Lebanon', status: 'available' },
            { id: '95', name: 'Lesotho', status: 'available' },
            { id: '96', name: 'Liberia', status: 'available' },
            { id: '97', name: 'Libya', status: 'available' },
            { id: '98', name: 'Liechtenstein', status: 'available' },
            { id: '99', name: 'Lithuania', status: 'available' },
            { id: '100', name: 'Luxembourg', status: 'available' },
            { id: '101', name: 'Madagascar', status: 'available' },
            { id: '102', name: 'Malawi', status: 'available' },
            { id: '103', name: 'Malaysia', status: 'available' },
            { id: '104', name: 'Maldives', status: 'available' },
            { id: '105', name: 'Mali', status: 'available' },
            { id: '106', name: 'Malta', status: 'available' },
            { id: '107', name: 'Marshall Islands', status: 'available' },
            { id: '108', name: 'Mauritania', status: 'available' },
            { id: '109', name: 'Mauritius', status: 'available' },
            { id: '110', name: 'Mexico', status: 'available' },
            { id: '111', name: 'Micronesia', status: 'available' },
            { id: '112', name: 'Moldova', status: 'available' },
            { id: '113', name: 'Monaco', status: 'available' },
            { id: '114', name: 'Mongolia', status: 'available' },
            { id: '115', name: 'Montenegro', status: 'available' },
            { id: '116', name: 'Morocco', status: 'available' },
            { id: '117', name: 'Mozambique', status: 'available' },
            { id: '118', name: 'Myanmar', status: 'available' },
            { id: '119', name: 'Namibia', status: 'available' },
            { id: '120', name: 'Nauru', status: 'available' },
            { id: '121', name: 'Nepal', status: 'available' },
            { id: '122', name: 'Netherlands', status: 'available' },
            { id: '123', name: 'New Zealand', status: 'available' },
            { id: '124', name: 'Nicaragua', status: 'available' },
            { id: '125', name: 'Niger', status: 'available' },
            { id: '126', name: 'Nigeria', status: 'available' },
            { id: '127', name: 'North Korea', status: 'available' },
            { id: '128', name: 'North Macedonia', status: 'available' },
            { id: '129', name: 'Norway', status: 'available' },
            { id: '130', name: 'Oman', status: 'available' },
            { id: '131', name: 'Pakistan', status: 'available' },
            { id: '132', name: 'Palau', status: 'available' },
            { id: '133', name: 'Panama', status: 'available' },
            { id: '134', name: 'Papua New Guinea', status: 'available' },
            { id: '135', name: 'Paraguay', status: 'available' },
            { id: '136', name: 'Peru', status: 'available' },
            { id: '137', name: 'Philippines', status: 'available' },
            { id: '138', name: 'Poland', status: 'available' },
            { id: '139', name: 'Portugal', status: 'available' },
            { id: '140', name: 'Qatar', status: 'available' },
            { id: '141', name: 'Romania', status: 'available' },
            { id: '142', name: 'Russia', status: 'available' },
            { id: '143', name: 'Rwanda', status: 'available' },
            { id: '144', name: 'Saint Kitts and Nevis', status: 'available' },
            { id: '145', name: 'Saint Lucia', status: 'available' },
            { id: '146', name: 'Saint Vincent and the Grenadines', status: 'available' },
            { id: '147', name: 'Samoa', status: 'available' },
            { id: '148', name: 'San Marino', status: 'available' },
            { id: '149', name: 'Sao Tome and Principe', status: 'available' },
            { id: '150', name: 'Saudi Arabia', status: 'available' },
            { id: '151', name: 'Senegal', status: 'available' },
            { id: '152', name: 'Serbia', status: 'available' },
            { id: '153', name: 'Seychelles', status: 'available' },
            { id: '154', name: 'Sierra Leone', status: 'available' },
            { id: '155', name: 'Singapore', status: 'available' },
            { id: '156', name: 'Slovakia', status: 'available' },
            { id: '157', name: 'Slovenia', status: 'available' },
            { id: '158', name: 'Solomon Islands', status: 'available' },
            { id: '159', name: 'Somalia', status: 'available' },
            { id: '160', name: 'South Africa', status: 'available' },
            { id: '161', name: 'South Sudan', status: 'available' },
            { id: '162', name: 'Spain', status: 'available' },
            { id: '163', name: 'Sri Lanka', status: 'available' },
            { id: '164', name: 'Sudan', status: 'available' },
            { id: '165', name: 'Suriname', status: 'available' },
            { id: '166', name: 'Sweden', status: 'available' },
            { id: '167', name: 'Switzerland', status: 'available' },
            { id: '168', name: 'Syria', status: 'available' },
            { id: '169', name: 'Tajikistan', status: 'available' },
            { id: '170', name: 'Tanzania', status: 'available' },
            { id: '171', name: 'Thailand', status: 'available' },
            { id: '172', name: 'Timor-Leste', status: 'available' },
            { id: '173', name: 'Togo', status: 'available' },
            { id: '174', name: 'Tonga', status: 'available' },
            { id: '175', name: 'Trinidad and Tobago', status: 'available' },
            { id: '176', name: 'Tunisia', status: 'available' },
            { id: '177', name: 'Turkey', status: 'available' },
            { id: '178', name: 'Turkmenistan', status: 'available' },
            { id: '179', name: 'Tuvalu', status: 'available' },
            { id: '180', name: 'Uganda', status: 'available' },
            { id: '181', name: 'Ukraine', status: 'available' },
            { id: '182', name: 'United Arab Emirates', status: 'available' },
            { id: '183', name: 'United Kingdom', status: 'available' },
            { id: '184', name: 'United States', status: 'available' },
            { id: '185', name: 'Uruguay', status: 'available' },
            { id: '186', name: 'Uzbekistan', status: 'available' },
            { id: '187', name: 'Vanuatu', status: 'available' },
            { id: '188', name: 'Venezuela', status: 'available' },
            { id: '189', name: 'Vietnam', status: 'available' },
            { id: '190', name: 'Yemen', status: 'available' },
            { id: '191', name: 'Zambia', status: 'available' },
            { id: '192', name: 'Zimbabwe', status: 'available' }
        ]
    },
    {
        id: 'uncsw',
        name: 'UNCSW',
        portfolios: [
            { id: '193', name: 'Angola', status: 'available' },
            { id: '194', name: 'Burkina Faso', status: 'available' },
            { id: '195', name: 'Cameroon', status: 'available' },
            { id: '196', name: 'Chad', status: 'available' },
            { id: '197', name: 'Comoros', status: 'available' },
            { id: '198', name: 'Congo', status: 'available' },
            { id: '199', name: 'Côte d’Ivoire', status: 'available' },
            { id: '200', name: 'Equatorial Guinea', status: 'available' },
            { id: '201', name: 'Kenya', status: 'available' },
            { id: '202', name: 'Liberia', status: 'available' },
            { id: '203', name: 'Madagascar', status: 'available' },
            { id: '204', name: 'Niger', status: 'available' },
            { id: '205', name: 'United Republic of Tanzania', status: 'available' },
            { id: '206', name: 'Bangladesh', status: 'available' },
            { id: '207', name: 'China', status: 'available' },
            { id: '208', name: 'India', status: 'available' },
            { id: '209', name: 'Indonesia', status: 'available' },
            { id: '210', name: 'Iran', status: 'available' },
            { id: '211', name: 'Japan', status: 'available' },
            { id: '212', name: 'Lebanon', status: 'available' },
            { id: '213', name: 'Mongolia', status: 'available' },
            { id: '214', name: 'Pakistan', status: 'available' },
            { id: '215', name: 'Philippines', status: 'available' },
            { id: '216', name: 'Saudi Arabia', status: 'available' },
            { id: '217', name: 'Argentina', status: 'available' },
            { id: '218', name: 'Bolivia', status: 'available' },
            { id: '219', name: 'Brazil', status: 'available' },
            { id: '220', name: 'Colombia', status: 'available' },
            { id: '221', name: 'Cuba', status: 'available' },
            { id: '222', name: 'Dominican Republic', status: 'available' },
            { id: '223', name: 'El Salvador', status: 'available' },
            { id: '224', name: 'Mexico', status: 'available' },
            { id: '225', name: 'Paraguay', status: 'available' },
            { id: '226', name: 'Austria', status: 'available' },
            { id: '227', name: 'Belgium', status: 'available' },
            { id: '228', name: 'Canada', status: 'available' },
            { id: '229', name: 'France', status: 'available' },
            { id: '230', name: 'Germany', status: 'available' },
            { id: '231', name: 'Italy', status: 'available' },
            { id: '232', name: 'Sweden', status: 'available' },
            { id: '233', name: 'United States', status: 'available' },
            { id: '234', name: 'Armenia', status: 'available' },
            { id: '235', name: 'Poland', status: 'available' },
            { id: '236', name: 'Romania', status: 'available' },
            { id: '237', name: 'Russian Federation', status: 'available' }
        ]
    },
    {
        id: 'unhrc',
        name: 'UNHRC',
        portfolios: [
            { id: '238', name: 'Albania', status: 'available' },
            { id: '239', name: 'Angola', status: 'available' },
            { id: '240', name: 'Benin', status: 'available' },
            { id: '241', name: 'Bolivia (Plurinational State of)', status: 'available' },
            { id: '242', name: 'Brazil', status: 'available' },
            { id: '243', name: 'Bulgaria', status: 'available' },
            { id: '244', name: 'Burundi', status: 'available' },
            { id: '245', name: 'Chile', status: 'available' },
            { id: '246', name: 'China', status: 'available' },
            { id: '247', name: 'Colombia', status: 'available' },
            { id: '248', name: 'Côte d’Ivoire', status: 'available' },
            { id: '249', name: 'Cuba', status: 'available' },
            { id: '250', name: 'Cyprus', status: 'available' },
            { id: '251', name: 'Czechia', status: 'available' },
            { id: '252', name: 'Democratic Republic of the Congo', status: 'available' },
            { id: '253', name: 'Dominican Republic', status: 'available' },
            { id: '254', name: 'Ecuador', status: 'available' },
            { id: '255', name: 'Egypt', status: 'available' },
            { id: '256', name: 'Estonia', status: 'available' },
            { id: '257', name: 'Ethiopia', status: 'available' },
            { id: '258', name: 'France', status: 'available' },
            { id: '259', name: 'Gambia', status: 'available' },
            { id: '260', name: 'Ghana', status: 'available' },
            { id: '261', name: 'Iceland', status: 'available' },
            { id: '262', name: 'India', status: 'available' },
            { id: '263', name: 'Indonesia', status: 'available' },
            { id: '264', name: 'Iraq', status: 'available' },
            { id: '265', name: 'Italy', status: 'available' },
            { id: '266', name: 'Japan', status: 'available' },
            { id: '267', name: 'Kenya', status: 'available' },
            { id: '268', name: 'Kuwait', status: 'available' },
            { id: '269', name: 'Malawi', status: 'available' },
            { id: '270', name: 'Marshall Islands', status: 'available' },
            { id: '271', name: 'Mauritius', status: 'available' },
            { id: '272', name: 'Mexico', status: 'available' },
            { id: '273', name: 'Netherlands (Kingdom of the)', status: 'available' },
            { id: '274', name: 'North Macedonia', status: 'available' },
            { id: '275', name: 'Pakistan', status: 'available' },
            { id: '276', name: 'Qatar', status: 'available' },
            { id: '277', name: 'Republic of Korea', status: 'available' },
            { id: '278', name: 'Slovenia', status: 'available' },
            { id: '279', name: 'South Africa', status: 'available' },
            { id: '280', name: 'Spain', status: 'available' },
            { id: '281', name: 'Switzerland', status: 'available' },
            { id: '282', name: 'Thailand', status: 'available' },
            { id: '283', name: 'United Kingdom of Great Britain and Northern Ireland', status: 'available' },
            { id: '284', name: 'Viet Nam', status: 'available' }
        ]
    },
    {
        id: 'who',
        name: 'WHO',
        portfolios: [
            { id: '249', name: 'Afghanistan', status: 'available' },
            { id: '250', name: 'Albania', status: 'available' },
            { id: '251', name: 'Algeria', status: 'available' },
            { id: '252', name: 'Andorra', status: 'available' },
            { id: '253', name: 'Angola', status: 'available' },
            { id: '254', name: 'Antigua and Barbuda', status: 'available' },
            { id: '255', name: 'Argentina', status: 'available' },
            { id: '256', name: 'Armenia', status: 'available' },
            { id: '257', name: 'Australia', status: 'available' },
            { id: '258', name: 'Austria', status: 'available' },
            { id: '259', name: 'Azerbaijan', status: 'available' },
            { id: '260', name: 'Bahamas', status: 'available' },
            { id: '261', name: 'Bahrain', status: 'available' },
            { id: '262', name: 'Bangladesh', status: 'available' },
            { id: '263', name: 'Barbados', status: 'available' },
            { id: '264', name: 'Belarus', status: 'available' },
            { id: '265', name: 'Belgium', status: 'available' },
            { id: '266', name: 'Belize', status: 'available' },
            { id: '267', name: 'Benin', status: 'available' },
            { id: '268', name: 'Bhutan', status: 'available' },
            { id: '269', name: 'Bolivia', status: 'available' },
            { id: '270', name: 'Bosnia and Herzegovina', status: 'available' },
            { id: '271', name: 'Botswana', status: 'available' },
            { id: '272', name: 'Brazil', status: 'available' },
            { id: '273', name: 'Brunei', status: 'available' },
            { id: '274', name: 'Bulgaria', status: 'available' },
            { id: '275', name: 'Burkina Faso', status: 'available' },
            { id: '276', name: 'Burundi', status: 'available' },
            { id: '277', name: 'Cabo Verde', status: 'available' },
            { id: '278', name: 'Cambodia', status: 'available' },
            { id: '279', name: 'Cameroon', status: 'available' },
            { id: '280', name: 'Canada', status: 'available' },
            { id: '281', name: 'Central African Republic', status: 'available' },
            { id: '282', name: 'Chad', status: 'available' },
            { id: '283', name: 'Chile', status: 'available' },
            { id: '284', name: 'China', status: 'available' },
            { id: '285', name: 'Colombia', status: 'available' },
            { id: '286', name: 'Comoros', status: 'available' },
            { id: '287', name: 'Congo', status: 'available' },
            { id: '288', name: 'Costa Rica', status: 'available' },
            { id: '289', name: 'Côte d’Ivoire', status: 'available' },
            { id: '290', name: 'Croatia', status: 'available' },
            { id: '291', name: 'Cuba', status: 'available' },
            { id: '292', name: 'Cyprus', status: 'available' },
            { id: '293', name: 'Czechia', status: 'available' },
            { id: '294', name: 'Democratic Republic of the Congo', status: 'available' },
            { id: '295', name: 'Denmark', status: 'available' },
            { id: '296', name: 'Djibouti', status: 'available' },
            { id: '297', name: 'Dominica', status: 'available' },
            { id: '298', name: 'Dominican Republic', status: 'available' },
            { id: '299', name: 'Ecuador', status: 'available' },
            { id: '300', name: 'Egypt', status: 'available' },
            { id: '301', name: 'El Salvador', status: 'available' },
            { id: '302', name: 'Equatorial Guinea', status: 'available' },
            { id: '303', name: 'Eritrea', status: 'available' },
            { id: '304', name: 'Estonia', status: 'available' },
            { id: '305', name: 'Eswatini', status: 'available' },
            { id: '306', name: 'Ethiopia', status: 'available' },
            { id: '307', name: 'Fiji', status: 'available' },
            { id: '308', name: 'Finland', status: 'available' },
            { id: '309', name: 'France', status: 'available' },
            { id: '310', name: 'Gabon', status: 'available' },
            { id: '311', name: 'Gambia', status: 'available' },
            { id: '312', name: 'Georgia', status: 'available' },
            { id: '313', name: 'Germany', status: 'available' },
            { id: '314', name: 'Ghana', status: 'available' },
            { id: '315', name: 'Greece', status: 'available' },
            { id: '316', name: 'Grenada', status: 'available' },
            { id: '317', name: 'Guatemala', status: 'available' },
            { id: '318', name: 'Guinea', status: 'available' },
            { id: '319', name: 'Guinea-Bissau', status: 'available' },
            { id: '320', name: 'Guyana', status: 'available' },
            { id: '321', name: 'Haiti', status: 'available' },
            { id: '322', name: 'Honduras', status: 'available' },
            { id: '323', name: 'Hungary', status: 'available' },
            { id: '324', name: 'Iceland', status: 'available' },
            { id: '325', name: 'India', status: 'available' },
            { id: '326', name: 'Indonesia', status: 'available' },
            { id: '327', name: 'Iran', status: 'available' },
            { id: '328', name: 'Iraq', status: 'available' },
            { id: '329', name: 'Ireland', status: 'available' },
            { id: '330', name: 'Israel', status: 'available' },
            { id: '331', name: 'Italy', status: 'available' },
            { id: '332', name: 'Jamaica', status: 'available' },
            { id: '333', name: 'Japan', status: 'available' },
            { id: '334', name: 'Jordan', status: 'available' },
            { id: '335', name: 'Kazakhstan', status: 'available' },
            { id: '336', name: 'Kenya', status: 'available' },
            { id: '337', name: 'Kiribati', status: 'available' },
            { id: '338', name: 'Kuwait', status: 'available' },
            { id: '339', name: 'Kyrgyzstan', status: 'available' },
            { id: '340', name: 'Laos', status: 'available' },
            { id: '341', name: 'Latvia', status: 'available' },
            { id: '342', name: 'Lebanon', status: 'available' },
            { id: '343', name: 'Lesotho', status: 'available' },
            { id: '344', name: 'Liberia', status: 'available' },
            { id: '345', name: 'Libya', status: 'available' },
            { id: '346', name: 'Liechtenstein', status: 'available' },
            { id: '347', name: 'Lithuania', status: 'available' },
            { id: '348', name: 'Luxembourg', status: 'available' },
            { id: '349', name: 'Madagascar', status: 'available' },
            { id: '350', name: 'Malawi', status: 'available' },
            { id: '351', name: 'Malaysia', status: 'available' },
            { id: '352', name: 'Maldives', status: 'available' },
            { id: '353', name: 'Mali', status: 'available' },
            { id: '354', name: 'Malta', status: 'available' },
            { id: '355', name: 'Marshall Islands', status: 'available' },
            { id: '356', name: 'Mauritania', status: 'available' },
            { id: '357', name: 'Mauritius', status: 'available' },
            { id: '358', name: 'Mexico', status: 'available' },
            { id: '359', name: 'Micronesia', status: 'available' },
            { id: '360', name: 'Moldova', status: 'available' },
            { id: '361', name: 'Monaco', status: 'available' },
            { id: '362', name: 'Mongolia', status: 'available' },
            { id: '363', name: 'Montenegro', status: 'available' },
            { id: '364', name: 'Morocco', status: 'available' },
            { id: '365', name: 'Mozambique', status: 'available' },
            { id: '366', name: 'Myanmar', status: 'available' },
            { id: '367', name: 'Namibia', status: 'available' },
            { id: '368', name: 'Nauru', status: 'available' },
            { id: '369', name: 'Nepal', status: 'available' },
            { id: '370', name: 'Netherlands', status: 'available' },
            { id: '371', name: 'New Zealand', status: 'available' },
            { id: '372', name: 'Nicaragua', status: 'available' },
            { id: '373', name: 'Niger', status: 'available' },
            { id: '374', name: 'Nigeria', status: 'available' },
            { id: '375', name: 'North Korea', status: 'available' },
            { id: '376', name: 'North Macedonia', status: 'available' },
            { id: '377', name: 'Norway', status: 'available' },
            { id: '378', name: 'Oman', status: 'available' },
            { id: '379', name: 'Pakistan', status: 'available' },
            { id: '380', name: 'Palau', status: 'available' },
            { id: '381', name: 'Panama', status: 'available' },
            { id: '382', name: 'Papua New Guinea', status: 'available' },
            { id: '383', name: 'Paraguay', status: 'available' },
            { id: '384', name: 'Peru', status: 'available' },
            { id: '385', name: 'Philippines', status: 'available' },
            { id: '386', name: 'Poland', status: 'available' },
            { id: '387', name: 'Portugal', status: 'available' },
            { id: '388', name: 'Qatar', status: 'available' },
            { id: '389', name: 'Romania', status: 'available' },
            { id: '390', name: 'Russia', status: 'available' },
            { id: '391', name: 'Rwanda', status: 'available' },
            { id: '392', name: 'Saint Kitts and Nevis', status: 'available' },
            { id: '393', name: 'Saint Lucia', status: 'available' },
            { id: '394', name: 'Saint Vincent and the Grenadines', status: 'available' },
            { id: '395', name: 'Samoa', status: 'available' },
            { id: '396', name: 'San Marino', status: 'available' },
            { id: '397', name: 'Sao Tome and Principe', status: 'available' },
            { id: '398', name: 'Saudi Arabia', status: 'available' },
            { id: '399', name: 'Senegal', status: 'available' },
            { id: '400', name: 'Serbia', status: 'available' },
            { id: '401', name: 'Seychelles', status: 'available' },
            { id: '402', name: 'Sierra Leone', status: 'available' },
            { id: '403', name: 'Singapore', status: 'available' },
            { id: '404', name: 'Slovakia', status: 'available' },
            { id: '405', name: 'Slovenia', status: 'available' },
            { id: '406', name: 'Solomon Islands', status: 'available' },
            { id: '407', name: 'Somalia', status: 'available' },
            { id: '408', name: 'South Africa', status: 'available' },
            { id: '409', name: 'South Sudan', status: 'available' },
            { id: '410', name: 'Spain', status: 'available' },
            { id: '411', name: 'Sri Lanka', status: 'available' },
            { id: '412', name: 'Sudan', status: 'available' },
            { id: '413', name: 'Suriname', status: 'available' },
            { id: '414', name: 'Sweden', status: 'available' },
            { id: '415', name: 'Switzerland', status: 'available' },
            { id: '416', name: 'Syria', status: 'available' },
            { id: '417', name: 'Tajikistan', status: 'available' },
            { id: '418', name: 'Tanzania', status: 'available' },
            { id: '419', name: 'Thailand', status: 'available' },
            { id: '420', name: 'Timor-Leste', status: 'available' },
            { id: '421', name: 'Togo', status: 'available' },
            { id: '422', name: 'Tonga', status: 'available' },
            { id: '423', name: 'Trinidad and Tobago', status: 'available' },
            { id: '424', name: 'Tunisia', status: 'available' },
            { id: '425', name: 'Turkey', status: 'available' },
            { id: '426', name: 'Turkmenistan', status: 'available' },
            { id: '427', name: 'Tuvalu', status: 'available' },
            { id: '428', name: 'Uganda', status: 'available' },
            { id: '429', name: 'Ukraine', status: 'available' },
            { id: '430', name: 'United Arab Emirates', status: 'available' },
            { id: '431', name: 'United Kingdom', status: 'available' },
            { id: '432', name: 'United States', status: 'available' },
            { id: '433', name: 'Uruguay', status: 'available' },
            { id: '434', name: 'Uzbekistan', status: 'available' },
            { id: '435', name: 'Vanuatu', status: 'available' },
            { id: '436', name: 'Venezuela', status: 'available' },
            { id: '437', name: 'Vietnam', status: 'available' },
            { id: '438', name: 'Yemen', status: 'available' },
            { id: '439', name: 'Zambia', status: 'available' },
            { id: '440', name: 'Zimbabwe', status: 'available' }
        ]
    },
    {
        id: 'aippm',
        name: 'AIPPM',
        portfolios: [
            { id: '441', name: 'Narendra Modi', position: 'Prime Minister', party: 'Bharatiya Janata Party (BJP)', status: 'available' },
            { id: '442', name: 'Rajnath Singh', position: 'Defence Minister', party: 'Bharatiya Janata Party (BJP)', status: 'available' },
            { id: '443', name: 'Amit Shah', position: 'Home Minister', party: 'Bharatiya Janata Party (BJP)', status: 'available' },
            { id: '444', name: 'Nirmala Sitharaman', position: 'Finance Minister', party: 'Bharatiya Janata Party (BJP)', status: 'available' },
            { id: '445', name: 'S. Jaishankar', position: 'External Affairs Minister', party: 'Bharatiya Janata Party (BJP)', status: 'available' },
            { id: '446', name: 'Nitin Gadkari', position: 'Minister for Road Transport and Highways', party: 'Bharatiya Janata Party (BJP)', status: 'available' },
            { id: '447', name: 'Piyush Goyal', position: 'Minister of Commerce and Industry', party: 'Bharatiya Janata Party (BJP)', status: 'available' },
            { id: '448', name: 'Ashwini Vaishnaw', position: 'Minister of Railways, Communications and IT', party: 'Bharatiya Janata Party (BJP)', status: 'available' },
            { id: '449', name: 'Dharmendra Pradhan', position: 'Minister of Education', party: 'Bharatiya Janata Party (BJP)', status: 'available' },
            { id: '450', name: 'Hardeep Singh Puri', position: 'Minister of Petroleum and Natural Gas', party: 'Bharatiya Janata Party (BJP)', status: 'available' },
            { id: '451', name: 'Jyotiraditya Scindia', position: 'Minister of Civil Aviation', party: 'Bharatiya Janata Party (BJP)', status: 'available' },
            { id: '452', name: 'Sarbananda Sonowal', position: 'Minister of Ports, Shipping and Waterways', party: 'Bharatiya Janata Party (BJP)', status: 'available' },
            { id: '453', name: 'Gajendra Singh Shekhawat', position: 'Minister of Jal Shakti', party: 'Bharatiya Janata Party (BJP)', status: 'available' },
            { id: '454', name: 'Bhupender Yadav', position: 'Minister of Environment, Forest and Climate Change', party: 'Bharatiya Janata Party (BJP)', status: 'available' },
            { id: '455', name: 'Mansukh Mandaviya', position: 'Minister of Labour and Employment', party: 'Bharatiya Janata Party (BJP)', status: 'available' },
            { id: '456', name: 'Kiren Rijiju', position: 'Minister of Parliamentary Affairs', party: 'Bharatiya Janata Party (BJP)', status: 'available' },
            { id: '457', name: 'J. P. Nadda', position: 'National President', party: 'Bharatiya Janata Party (BJP)', status: 'available' },
            { id: '458', name: 'Rahul Gandhi', position: 'Member of Parliament', party: 'Indian National Congress (INC)', status: 'available' },
            { id: '459', name: 'Mallikarjun Kharge', position: 'Leader of Opposition (Rajya Sabha)', party: 'Indian National Congress (INC)', status: 'available' },
            { id: '460', name: 'Shashi Tharoor', position: 'Member of Parliament', party: 'Indian National Congress (INC)', status: 'available' },
            { id: '461', name: 'Adhir Ranjan Chowdhury', position: 'Senior Leader', party: 'Indian National Congress (INC)', status: 'available' },
            { id: '462', name: 'Arvind Kejriwal', position: 'National Convenor', party: 'Aam Aadmi Party (AAP)', status: 'available' },
            { id: '463', name: 'Atishi', position: 'Chief Minister of Delhi', party: 'Aam Aadmi Party (AAP)', status: 'available' },
            { id: '464', name: 'Mamata Banerjee', position: 'Chief Minister of West Bengal', party: 'All India Trinamool Congress (TMC)', status: 'available' },
            { id: '465', name: 'Akhilesh Yadav', position: 'Party President', party: 'Samajwadi Party (SP)', status: 'available' },
            { id: '466', name: 'Tejashwi Yadav', position: 'Leader', party: 'Rashtriya Janata Dal (RJD)', status: 'available' },
            { id: '467', name: 'Nitish Kumar', position: 'Chief Minister of Bihar', party: 'Janata Dal (United)', status: 'available' },
            { id: '468', name: 'Uddhav Thackeray', position: 'Party Chief', party: 'Shiv Sena (UBT)', status: 'available' },
            { id: '469', name: 'Eknath Shinde', position: 'Chief Minister of Maharashtra', party: 'Shiv Sena', status: 'available' },
            { id: '470', name: 'Devendra Fadnavis', position: 'Deputy Chief Minister of Maharashtra', party: 'Bharatiya Janata Party (BJP)', status: 'available' },
            { id: '471', name: 'Yogi Adityanath', position: 'Chief Minister of Uttar Pradesh', party: 'Bharatiya Janata Party (BJP)', status: 'available' },
            { id: '472', name: 'K. Chandrashekar Rao', position: 'Party President', party: 'Bharat Rashtra Samithi (BRS)', status: 'available' },
            { id: '473', name: 'M. K. Stalin', position: 'Chief Minister of Tamil Nadu', party: 'Dravida Munnetra Kazhagam (DMK)', status: 'available' },
            { id: '474', name: 'Pinarayi Vijayan', position: 'Chief Minister of Kerala', party: 'Communist Party of India (Marxist)', status: 'available' },
            { id: '475', name: 'Chirag Paswan', position: 'Party President', party: 'Lok Janshakti Party (Ram Vilas)', status: 'available' },
            { id: '476', name: 'Asaduddin Owaisi', position: 'Party President', party: 'All India Majlis-e-Ittehadul Muslimeen (AIMIM)', status: 'available' },
            { id: '477', name: 'Sukhbir Singh Badal', position: 'Party President', party: 'Shiromani Akali Dal (SAD)', status: 'available' },
            { id: '478', name: 'Hemant Soren', position: 'Chief Minister of Jharkhand', party: 'Jharkhand Mukti Morcha (JMM)', status: 'available' }
        ]
    },
    {
        id: 'ip',
        name: 'International Press (IP)',
        portfolios: [
            { id: '479', name: 'Journalist', status: 'available' },
            { id: '480', name: 'Caricaturist', status: 'avialable' },
            { id: '481', name: 'Photographer', status: 'available' },
        ]
    }
];

// ─── Apply taken status from Firebase data ───
if (window.__takenPortfolios) {
    const takenMap = window.__takenPortfolios;
    COMMITTEES.forEach(com => {
        const takenSet = takenMap[com.id];
        if (takenSet && takenSet.size > 0) {
            com.portfolios.forEach(port => {
                if (takenSet.has(port.name)) {
                    port.status = 'taken';
                }
            });
        }
    });
    console.log('✅ Portfolio statuses updated from Firebase');
}

const container = document.getElementById('committees-container');
const submitBtn = document.getElementById('mun-submit-btn');
const countDisplay = document.getElementById('select-count');
const statusBadge = document.querySelector('.selection-status');
const searchInput = document.getElementById('portfolio-search');
const searchCount = document.getElementById('search-count');

// Track selected portfolios. Max 2.
// Format: [{ committeeId, portfolioId, portfolioName }]
let selectedPortfolios = [];
let currentSearch = '';

// ─── Render Committees ───
function render(searchQuery = '') {
    container.innerHTML = '';
    const query = searchQuery.trim().toLowerCase();
    let totalMatches = 0;

    COMMITTEES.forEach(com => {
        // Filter portfolios by search query
        const filteredPortfolios = query
            ? com.portfolios.filter(port => {
                const searchable = [port.name, port.position, port.party]
                    .filter(Boolean).join(' ').toLowerCase();
                return searchable.includes(query);
              })
            : com.portfolios;

        // Skip committee entirely if no matches during search
        if (query && filteredPortfolios.length === 0) return;

        totalMatches += filteredPortfolios.length;

        const group = document.createElement('div');
        group.className = 'committee-group';
        group.id = `group-${com.id}`;

        // Check if user has selected a portfolio in this committee
        const isSelectedHere = selectedPortfolios.some(p => p.committeeId === com.id);
        if (isSelectedHere) {
            group.classList.add('has-selection');
        }

        // Auto-expand when searching
        if (query) {
            group.classList.add('expanded');
        }

        // Header
        const header = document.createElement('div');
        header.className = 'committee-header';
        header.innerHTML = `
            <div class="committee-title">
                ${com.name}
                ${query ? `<span class="search-match-count">${filteredPortfolios.length}</span>` : ''}
                <span class="selected-badge">Selected</span>
            </div>
            <svg class="expand-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        `;

        // Toggle expand/collapse
        header.addEventListener('click', () => {
            const isExpanded = group.classList.contains('expanded');
            // Close all others
            document.querySelectorAll('.committee-group').forEach(g => g.classList.remove('expanded'));
            if (!isExpanded) {
                group.classList.add('expanded');
            }
        });

        // Portfolios List
        const list = document.createElement('div');
        list.className = 'portfolio-list';

        filteredPortfolios.forEach(port => {
            const isTaken = port.status === 'taken';
            const isChecked = selectedPortfolios.some(p => p.portfolioId === port.id);
            const item = document.createElement('div');
            item.className = `portfolio-item ${isTaken ? 'taken' : ''}`;

            const idStr = `port-${com.id}-${port.id}`;

            const statusClass = isTaken ? 'status-taken' : 'status-available';
            const statusText = isTaken ? 'Taken' : 'Available';

            // Highlight matching text
            const displayName = query ? highlightMatch(port.name, query) : port.name;

            const hasExtraInfo = port.position || port.party;
            const extraInfoHtml = hasExtraInfo ? `
                <div class="portfolio-details">
                    ${port.position ? `<span class="portfolio-position">${query ? highlightMatch(port.position, query) : port.position}</span>` : ''}
                    ${port.party ? `<span class="portfolio-party">${query ? highlightMatch(port.party, query) : port.party}</span>` : ''}
                </div>
            ` : '';

            item.innerHTML = `
                <input type="checkbox" id="${idStr}" value="${port.id}" ${isChecked ? 'checked' : ''} ${isTaken ? 'disabled' : ''}>
                <label for="${idStr}">
                    <div class="portfolio-info">
                        <span class="portfolio-name">${displayName}</span>
                        ${extraInfoHtml}
                    </div>
                    <span class="status-indicator ${statusClass}">${statusText}</span>
                </label>
            `;

            if (!isTaken) {
                const input = item.querySelector('input');
                input.addEventListener('change', (e) => {
                    handleSelectionChange(e.target.checked, com.id, com.name, port.id, port.name, port.position, port.party, input);
                });
            }

            list.appendChild(item);
        });

        group.appendChild(header);
        group.appendChild(list);
        container.appendChild(group);
    });

    // Show no-results message
    if (query && totalMatches === 0) {
        container.innerHTML = `<div class="no-results">No portfolios found for "<strong>${escapeHtml(searchQuery)}</strong>"</div>`;
    }

    // Update search count badge
    if (query) {
        searchCount.textContent = `${totalMatches} found`;
        searchCount.classList.add('visible');
    } else {
        searchCount.classList.remove('visible');
    }

    updateUIState();
}

// ─── Highlight matched text ───
function highlightMatch(text, query) {
    if (!query) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ─── Search handler ───
searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    render(currentSearch);
});

// ─── Selection Logic ───
function handleSelectionChange(isChecked, comId, comName, portId, portName, pos, party, inputEl) {
    if (isChecked) {
        // Enforce single selection: Clear others and select this one
        selectedPortfolios = [{
            committeeId: comId,
            committeeName: comName,
            portfolioId: portId,
            portfolioName: portName,
            position: pos || null,
            party: party || null
        }];
    } else {
        selectedPortfolios = [];
    }

    render(currentSearch); // Re-render to update badges and checked states
}

function updateUIState() {
    const count = selectedPortfolios.length;
    countDisplay.textContent = count;

    if (count === 1) {
        statusBadge.classList.add('complete');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Continue to Personal Details →';
    } else {
        statusBadge.classList.remove('complete');
        submitBtn.disabled = true;
        submitBtn.textContent = `Select 1 portfolio...`;
    }
}

// ─── Submission ───
submitBtn.addEventListener('click', () => {
    if (selectedPortfolios.length !== 1) return;

    // Save MUN selection
    sessionStorage.setItem('nydc_mun_selection', JSON.stringify(selectedPortfolios));
    
    // Redirect to selection.html for the final review/submission
    // Since MUN is a solo event, they won't add team members, but selection.html has the final Firebase submit button.
    window.location.href = 'selection.html';
});

// Init
render();
