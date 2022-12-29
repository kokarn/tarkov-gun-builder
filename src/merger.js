// https://api.tarkov.dev/___graphql
// {
//     itemsByType(type: any){
//       id
//                 bsgCategoryId
//       name
//       shortName
//                 normalizedName
//       types
//       width
//       height
//                 avg24hPrice
//       wikiLink
//                 changeLast48h
//       low24hPrice
//       high24hPrice
//       lastLowPrice
//                 gridImageLink
//                 iconLink
//                 updated
//                 weight
//       hasGrid
//                 conflictingItems {
//         id
//       }
//       containsItems {
//         item {
//           id
//         }
//       }
//               conflictingSlotIds
//     }
//   }
const itemsFromTarkovDevApi = require('./items-from-tarkov-dev-api.json');

// RAW DATA FROM BSG
const latestDumpFromBsg = require('./latest-dump-from-bsg.json');

// this is used only to get the right image
// https://api.tarkov.dev/___graphql
// query {
//     items(type: gun) {
//       id
//       name
//       properties {
//         ...on ItemPropertiesWeapon {
//           defaultPreset {
//             gridImageLink
//           }
//         }
//       }
//     }
// }
const gunDataFromApi = {
    data: {
        items: [
            {
                id: '5447a9cd4bdc2dbd208b4567',
                name: 'Colt M4A1 5.56x45 assault rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5af08cf886f774223c269184-grid-image.jpg',
                    },
                },
            },
            {
                id: '5448bd6b4bdc2dfc2f8b4569',
                name: 'Makarov PM 9x18PM pistol',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/58414967245977598f1ad391-grid-image.jpg',
                    },
                },
            },
            {
                id: '54491c4f4bdc2db1078b4568',
                name: 'MP-133 12ga pump-action shotgun',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/584148f2245977598f1ad387-grid-image.jpg',
                    },
                },
            },
            {
                id: '55801eed4bdc2d89578b4588',
                name: 'SV-98 7.62x54R bolt-action sniper rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/58414a16245977599247970a-grid-image.jpg',
                    },
                },
            },
            {
                id: '5580223e4bdc2d1c128b457f',
                name: 'MP-43-1C 12ga double-barrel shotgun',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/6197d1f3585c515a052ad88f-grid-image.jpg',
                    },
                },
            },
            {
                id: '5644bd2b4bdc2d3b4c8b4572',
                name: 'Kalashnikov AK-74N 5.45x39 assault rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5841474424597759ba49be91-grid-image.jpg',
                    },
                },
            },
            {
                id: '56d59856d2720bd8418b456a',
                name: 'SIG P226R 9x19 pistol',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/584149242459775a7726350a-grid-image.jpg',
                    },
                },
            },
            {
                id: '56dee2bdd2720bc8328b4567',
                name: 'MP-153 12ga semi-automatic shotgun',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/58414907245977598f1ad38d-grid-image.jpg',
                    },
                },
            },
            {
                id: '56e0598dd2720bb5668b45a6',
                name: 'PB 9x18PM silenced pistol',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/584149452459775992479702-grid-image.jpg',
                    },
                },
            },
            {
                id: '571a12c42459771f627b58a0',
                name: 'TT-33 7.62x25 TT pistol',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/58414a2724597759b344da4d-grid-image.jpg',
                    },
                },
            },
            {
                id: '574d967124597745970e7c94',
                name: 'Simonov SKS 7.62x39 carbine',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/58dffce486f77409f40f8162-grid-image.jpg',
                    },
                },
            },
            {
                id: '576165642459773c7a400233',
                name: 'Saiga 12ga ver.10 12/76 semi-automatic shotgun',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/58414a052459775a2b6d9f1e-grid-image.jpg',
                    },
                },
            },
            {
                id: '576a581d2459771e7b1bc4f1',
                name: 'Yarygin MP-443 "Grach" 9x19 pistol',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/584148a524597759eb357a44-grid-image.jpg',
                    },
                },
            },
            {
                id: '57838ad32459774a17445cd2',
                name: 'VSS Vintorez 9x39 special sniper rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/58414a3f2459775a77263531-grid-image.jpg',
                    },
                },
            },
            {
                id: '579204f224597773d619e051',
                name: 'Makarov PM (t) 9x18PM pistol',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5841499024597759f825ff3e-grid-image.jpg',
                    },
                },
            },
            {
                id: '57c44b372459772d2b39b8ce',
                name: 'AS VAL 9x39 special assault rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5841482e2459775a050cdda9-grid-image.jpg',
                    },
                },
            },
            {
                id: '57d14d2524597714373db789',
                name: 'PP-91 "Kedr" 9x18PM submachine gun',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/584149c42459775a77263510-grid-image.jpg',
                    },
                },
            },
            {
                id: '57dc2fa62459775949412633',
                name: 'Kalashnikov AKS-74U 5.45x39 assault rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/584147732459775a2b6d9f12-grid-image.jpg',
                    },
                },
            },
            {
                id: '57f3c6bd24597738e730fa2f',
                name: 'PP-91-01 "Kedr-B" 9x18PM submachine gun',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/584149ea2459775a6c55e940-grid-image.jpg',
                    },
                },
            },
            {
                id: '57f4c844245977379d5c14d1',
                name: 'PP-9 "Klin" 9x18PMM submachine gun',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/584149ad2459775a7726350e-grid-image.jpg',
                    },
                },
            },
            {
                id: '583990e32459771419544dd2',
                name: 'Kalashnikov AKS-74UN 5.45x39 assault rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/584147ed2459775a77263501-grid-image.jpg',
                    },
                },
            },
            {
                id: '5839a40f24597726f856b511',
                name: 'Kalashnikov AKS-74UB 5.45x39 assault rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/584147982459775a6c55e931-grid-image.jpg',
                    },
                },
            },
            {
                id: '587e02ff24597743df3deaeb',
                name: 'Simonov OP-SKS 7.62x39 carbine (Hunting Rifle Version)',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/59dcdbb386f77417b03f350d-grid-image.jpg',
                    },
                },
            },
            {
                id: '588892092459774ac91d4b11',
                name: 'Lobaev Arms DVL-10 7.62x51 bolt-action sniper rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/58dffc5d86f77407c744a847-grid-image.jpg',
                    },
                },
            },
            {
                id: '58948c8e86f77409493f7266',
                name: 'SIG MPX 9x19 submachine gun',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/58dffca786f774083a256ab1-grid-image.jpg',
                    },
                },
            },
            {
                id: '5926bb2186f7744b1c6c6e60',
                name: 'HK MP5 9x19 submachine gun (Navy 3 Round Burst)',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/59411aa786f7747aeb37f9a5-grid-image.jpg',
                    },
                },
            },
            {
                id: '59984ab886f7743e98271174',
                name: 'PP-19-01 "Vityaz" 9x19 submachine gun',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/59b81f7386f77421ac688a0a-grid-image.jpg',
                    },
                },
            },
            {
                id: '59d6088586f774275f37482f',
                name: 'Kalashnikov AKM 7.62x39 assault rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/59e8d2ab86f77407f03fc9c2-grid-image.jpg',
                    },
                },
            },
            {
                id: '59e6152586f77473dc057aa1',
                name: 'Molot VPO-136 "Vepr-KM" 7.62x39 carbine',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/59ef24b986f77439987b8762-grid-image.jpg',
                    },
                },
            },
            {
                id: '59e6687d86f77411d949b251',
                name: 'Molot VPO-209 .366 TKM carbine',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/59ef247086f77439967a900a-grid-image.jpg',
                    },
                },
            },
            {
                id: '59f98b4986f7746f546d2cef',
                name: 'Serdyukov SR-1MP Gyurza 9x21 pistol',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5a327f6386f77479010da870-grid-image.jpg',
                    },
                },
            },
            {
                id: '59f9cabd86f7743a10721f46',
                name: 'Saiga-9 9x19 carbine',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5a13df5286f774032f5454a0-grid-image.jpg',
                    },
                },
            },
            {
                id: '59ff346386f77477562ff5e2',
                name: 'Kalashnikov AKMS 7.62x39 assault rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5a327f4a86f774766866140b-grid-image.jpg',
                    },
                },
            },
            {
                id: '5a0ec13bfcdbcb00165aa685',
                name: 'Kalashnikov AKMN 7.62x39 assault rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5a325c3686f7744273716c5b-grid-image.jpg',
                    },
                },
            },
            {
                id: '5a17f98cfcdbcb0980087290',
                name: 'Stechkin APS 9x18PM machine pistol',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5ac4accf86f774181345c3d7-grid-image.jpg',
                    },
                },
            },
            {
                id: '5a367e5dc4a282000e49738f',
                name: 'Remington R11 RSASS 7.62x51 marksman rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5a3a85af86f774745637d46c-grid-image.jpg',
                    },
                },
            },
            {
                id: '5a38e6bac4a2826c6e06d79b',
                name: 'TOZ-106 20ga bolt-action shotgun',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5a3a859786f7747e2305e8bf-grid-image.jpg',
                    },
                },
            },
            {
                id: '5a7828548dc32e5a9c28b516',
                name: 'Remington Model 870 12ga pump-action shotgun',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5ac4ad7586f7747d14551da3-grid-image.jpg',
                    },
                },
            },
            {
                id: '5a7ae0c351dfba0017554310',
                name: 'Glock 17 9x19 pistol',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5a88acfb86f77457fd2c0d8f-grid-image.jpg',
                    },
                },
            },
            {
                id: '5aafa857e5b5b00018480968',
                name: 'Springfield Armory M1A 7.62x51 rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5ac4ad3686f774181345c3da-grid-image.jpg',
                    },
                },
            },
            {
                id: '5ab8e9fcd8ce870019439434',
                name: 'Kalashnikov AKS-74N 5.45x39 assault rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5ac4abf986f7747d117c67aa-grid-image.jpg',
                    },
                },
            },
            {
                id: '5abcbc27d8ce8700182eceeb',
                name: 'Kalashnikov AKMSN 7.62x39 assault rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5ac4ab8886f7747d0f66429a-grid-image.jpg',
                    },
                },
            },
            {
                id: '5abccb7dd8ce87001773e277',
                name: 'APB 9x18PM silenced machine pistol',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5ac4ac9486f774181345c3d2-grid-image.jpg',
                    },
                },
            },
            {
                id: '5ac4cd105acfc40016339859',
                name: 'Kalashnikov AK-74M 5.45x39 assault rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5acf7db286f7743a9c7092e3-grid-image.jpg',
                    },
                },
            },
            {
                id: '5ac66cb05acfc40198510a10',
                name: 'Kalashnikov AK-101 5.56x45 assault rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5acf7dd986f774486e1281bf-grid-image.jpg',
                    },
                },
            },
            {
                id: '5ac66d015acfc400180ae6e4',
                name: 'Kalashnikov AK-102 5.56x45 assault rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5acf7dfc86f774401e19c390-grid-image.jpg',
                    },
                },
            },
            {
                id: '5ac66d2e5acfc43b321d4b53',
                name: 'Kalashnikov AK-103 7.62x39 assault rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5acf7e2b86f7740874790e20-grid-image.jpg',
                    },
                },
            },
            {
                id: '5ac66d725acfc43b321d4b60',
                name: 'Kalashnikov AK-104 7.62x39 assault rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5acf7e4c86f774499a3f3bdd-grid-image.jpg',
                    },
                },
            },
            {
                id: '5ac66d9b5acfc4001633997a',
                name: 'Kalashnikov AK-105 5.45x39 assault rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5acf7e7986f774401e19c3a0-grid-image.jpg',
                    },
                },
            },
            {
                id: '5ae08f0a5acfc408fb1398a1',
                name: 'Mosin 7.62x54R bolt-action rifle (Sniper)',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5b8683a486f77467f2423114-grid-image.jpg',
                    },
                },
            },
            {
                id: '5b0bbe4e5acfc40dc528a72d',
                name: 'DS Arms SA-58 7.62x51 assault rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5b439b5686f77428bd137424-grid-image.jpg',
                    },
                },
            },
            {
                id: '5b1fa9b25acfc40018633c01',
                name: 'Glock 18C 9x19 machine pistol',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5b439b1f86f7744fd8059cbe-grid-image.jpg',
                    },
                },
            },
            {
                id: '5b3b713c5acfc4330140bd8d',
                name: 'TT-33 7.62x25 TT pistol (Golden)',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5b44abe986f774283e2e3512-grid-image.jpg',
                    },
                },
            },
            {
                id: '5ba26383d4351e00334c93d9',
                name: 'HK MP7A1 4.6x30 submachine gun',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5bd056fa86f7743aba7658cd-grid-image.jpg',
                    },
                },
            },
            {
                id: '5bb2475ed4351e00853264e3',
                name: 'HK 416A5 5.56x45 assault rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5c0d1e9386f77440120288b7-grid-image.jpg',
                    },
                },
            },
            {
                id: '5bd70322209c4d00d7167b8f',
                name: 'HK MP7A2 4.6x30 submachine gun',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5bdb3ac186f77405f232ad22-grid-image.jpg',
                    },
                },
            },
            {
                id: '5beed0f50db834001c062b12',
                name: 'RPK-16 5.45x39 light machine gun',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5c0d1ec986f77439512a1a72-grid-image.jpg',
                    },
                },
            },
            {
                id: '5bf3e03b0db834001d2c4a9c',
                name: 'Kalashnikov AK-74 5.45x39 assault rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5c0c1ce886f77401c119d014-grid-image.jpg',
                    },
                },
            },
            {
                id: '5bf3e0490db83400196199af',
                name: 'Kalashnikov AKS-74 5.45x39 assault rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5c0c1d2b86f77401c119d01f-grid-image.jpg',
                    },
                },
            },
            {
                id: '5bfd297f0db834001a669119',
                name: 'Mosin 7.62x54R bolt-action rifle (Infantry)',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5c0c1e7486f7744dba7a289b-grid-image.jpg',
                    },
                },
            },
            {
                id: '5bfea6e90db834001b7347f3',
                name: 'Remington Model 700 7.62x51 bolt-action sniper rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5c0c1d6586f7743e5335d264-grid-image.jpg',
                    },
                },
            },
            {
                id: '5c07c60e0db834002330051f',
                name: 'ADAR 2-15 5.56x45 carbine',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5c10fcb186f774533e5529ab-grid-image.jpg',
                    },
                },
            },
            {
                id: '5c46fbd72e2216398b5a8c9c',
                name: 'SVDS 7.62x54R sniper rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5c98be1e86f7741cc96ffd79-grid-image.jpg',
                    },
                },
            },
            {
                id: '5c488a752e221602b412af63',
                name: 'Desert Tech MDR 5.56x45 assault rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5c98bd7386f7740cfb15654e-grid-image.jpg',
                    },
                },
            },
            {
                id: '5c501a4d2e221602b412b540',
                name: 'Molot VPO-101 "Vepr-Hunter" 7.62x51 carbine',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5c98bf9186f7740cf708c509-grid-image.jpg',
                    },
                },
            },
            {
                id: '5cadc190ae921500103bb3b6',
                name: 'Beretta M9A3 9x19 pistol',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5d3f0bc986f7743cb332abdc-grid-image.jpg',
                    },
                },
            },
            {
                id: '5cadfbf7ae92152ac412eeef',
                name: 'ASh-12 12.7x55 assault rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5d23467086f77443f37fc602-grid-image.jpg',
                    },
                },
            },
            {
                id: '5cc82d76e24e8d00134b4b83',
                name: 'FN P90 5.7x28 submachine gun',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5d23376786f77459bb77d838-grid-image.jpg',
                    },
                },
            },
            {
                id: '5d2f0d8048f0356c925bc3b0',
                name: 'HK MP5K 9x19 submachine gun',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5d3f06c886f7743bb5318c6a-grid-image.jpg',
                    },
                },
            },
            {
                id: '5d3eb3b0a4b93615055e84d2',
                name: 'FN Five-seveN MK2 5.7x28 pistol',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5d51290186f77419093e7c24-grid-image.jpg',
                    },
                },
            },
            {
                id: '5d43021ca4b9362eab4b5e25',
                name: 'Lone Star TX-15 DML 5.56x45 carbine',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5d4d617f86f77449c463d107-grid-image.jpg',
                    },
                },
            },
            {
                id: '5d67abc1a4b93614ec50137f',
                name: 'FN Five-seveN MK2 5.7x28 pistol (FDE)',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5d7b845786f7743c1e531da7-grid-image.jpg',
                    },
                },
            },
            {
                id: '5dcbd56fdbd3d91b3e5468d5',
                name: 'Desert Tech MDR 7.62x51 assault rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5e035eb586f774756048ec12-grid-image.jpg',
                    },
                },
            },
            {
                id: '5de652c31b7e3716273428be',
                name: 'Molot VPO-215 "Gornostay" .366 TKM bolt-action rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5e0359bd86f7746b243db876-grid-image.jpg',
                    },
                },
            },
            {
                id: '5de7bd7bfd6b4e6e2276dc25',
                name: 'B&T MP9-N 9x19 submachine gun',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5e03410186f77469041348ea-grid-image.jpg',
                    },
                },
            },
            {
                id: '5df24cf80dee1b22f862e9bc',
                name: 'ORSIS T-5000M 7.62x51 bolt-action sniper rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5e0354f786f77425b53eb6c5-grid-image.jpg',
                    },
                },
            },
            {
                id: '5df8ce05b11454561e39243b',
                name: "Knight's Armament Company SR-25 7.62x51 marksman rifle",
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5e03511086f7744ccb1fb6cf-grid-image.jpg',
                    },
                },
            },
            {
                id: '5e00903ae9dc277128008b87',
                name: 'B&T MP9 9x19 submachine gun',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5e0340ab86f7745bb7339235-grid-image.jpg',
                    },
                },
            },
            {
                id: '5e81c3cbac2bb513793cdc75',
                name: 'Colt M1911A1 .45 ACP pistol',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5eb2968186f7746d1f1a4fd5-grid-image.jpg',
                    },
                },
            },
            {
                id: '5e81ebcd8e146c7080625e15',
                name: 'FN40GL Mk2 40mm grenade launcher',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5f06d6e1475d472556679d16-grid-image.jpg',
                    },
                },
            },
            {
                id: '5e848cc2988a8701445df1e8',
                name: 'TOZ KS-23M 23x75mm pump-action shotgun',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5f6771214ef1ca4f4e1b8a06-grid-image.jpg',
                    },
                },
            },
            {
                id: '5e870397991fd70db46995c8',
                name: 'Mossberg 590A1 12ga pump-action shotgun',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5f06d6bb4010601e3232cd22-grid-image.jpg',
                    },
                },
            },
            {
                id: '5ea03f7400685063ec28bfa8',
                name: 'PPSh-41 7.62x25 submachine gun',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5eb2963686f7742d3f5ab0f8-grid-image.jpg',
                    },
                },
            },
            {
                id: '5f2a9575926fd9352339381f',
                name: 'Kel-Tec RFB 7.62x51 rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5f676b779ab5ec19f028eaf3-grid-image.jpg',
                    },
                },
            },
            {
                id: '5f36a0e5fbf956000b716b65',
                name: 'Colt M45A1 .45 ACP pistol',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5f6762e964af6a2aa319deeb-grid-image.jpg',
                    },
                },
            },
            {
                id: '5fb64bc92b1b027b1f50bcf2',
                name: 'TDI KRISS Vector Gen.2 .45 ACP submachine gun',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5fd251ee16cac650092f5d02-grid-image.jpg',
                    },
                },
            },
            {
                id: '5fbcc1d9016cce60e8341ab3',
                name: 'SIG MCX .300 Blackout assault rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5fd251a31189a17bcc172662-grid-image.jpg',
                    },
                },
            },
            {
                id: '5fc22d7c187fea44d52eda44',
                name: 'SWORD International Mk-18 .338 LM marksman rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5fd25119dd870108a754a163-grid-image.jpg',
                    },
                },
            },
            {
                id: '5fc3e272f8b6a877a729eac5',
                name: 'HK UMP .45 ACP submachine gun',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5fd2517dbdd50d684f73a474-grid-image.jpg',
                    },
                },
            },
            {
                id: '5fc3f2d5900b1d5091531e57',
                name: 'TDI KRISS Vector Gen.2 9x19 submachine gun',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/5fd251c90d9c95034825edb5-grid-image.jpg',
                    },
                },
            },
            {
                id: '602a9740da11d6478d5a06dc',
                name: 'Lebedev PL-15 9x19 pistol',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/60479fb29c15b12b9a480fb0-grid-image.jpg',
                    },
                },
            },
            {
                id: '60339954d62c9b14ed777c06',
                name: 'Soyuz-TM STM-9 Gen.2 9x19 carbine',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/60479c3f420fac5ebc199f86-grid-image.jpg',
                    },
                },
            },
            {
                id: '606587252535c57a13424cfd',
                name: 'CMMG Mk47 Mutant 7.62x39 assault rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/60b7d76e2a3c79100f1979de-grid-image.jpg',
                    },
                },
            },
            {
                id: '606dae0ab0e443224b421bb7',
                name: 'MP-155 12ga semi-automatic shotgun',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/60b7c28ee53e4c5c8945dd73-grid-image.jpg',
                    },
                },
            },
            {
                id: '60db29ce99594040e04c4a27',
                name: 'MTs-255-12 12ga shotgun',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/6198e2ddef80673cae5d1c87-grid-image.jpg',
                    },
                },
            },
            {
                id: '6165ac306ef05c2ce828ef74',
                name: 'FN SCAR-H 7.62x51 assault rifle (FDE)',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/6193e4fae693542ea37d11c6-grid-image.jpg',
                    },
                },
            },
            {
                id: '6176aca650224f204c1da3fb',
                name: 'HK G28 7.62x51 marksman rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/6193e590069d61205d490dd8-grid-image.jpg',
                    },
                },
            },
            {
                id: '6183afd850224f204c1da514',
                name: 'FN SCAR-H 7.62x51 assault rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/6193e4a46bb904059c382295-grid-image.jpg',
                    },
                },
            },
            {
                id: '6184055050224f204c1da540',
                name: 'FN SCAR-L 5.56x45 assault rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/6193e18de693542ea37d11b3-grid-image.jpg',
                    },
                },
            },
            {
                id: '618428466ef05c2ce828f218',
                name: 'FN SCAR-L 5.56x45 assault rifle (FDE)',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/6193e226449ec003d9127fa6-grid-image.jpg',
                    },
                },
            },
            {
                id: '6193a720f8ee7e52e42109ed',
                name: 'HK USP .45 ACP pistol',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/619d267f36b5be1f3236f9ba-grid-image.jpg',
                    },
                },
            },
            {
                id: '61a4c8884f95bc3b2c5dc96f',
                name: 'Chiappa Rhino 50DS .357 revolver',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/624d7a3691f0160c7324c3f4-grid-image.jpg',
                    },
                },
            },
            {
                id: '61f7c9e189e6fb1a5e3ea78d',
                name: 'MP-18 7.62x54R single-shot rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/629792f0fd6eda47d6466fe8-grid-image.jpg',
                    },
                },
            },
            {
                id: '620109578d82e67e7911abf2',
                name: 'ZiD SP-81 26x75 signal pistol',
                properties: {
                    defaultPreset: null,
                },
            },
            {
                id: '6217726288ed9f0845317459',
                name: 'RSP-30 reactive signal cartridge (Green)',
                properties: {
                    defaultPreset: null,
                },
            },
            {
                id: '62178be9d0050232da3485d9',
                name: 'ROP-30 reactive flare cartridge (White)',
                properties: {
                    defaultPreset: null,
                },
            },
            {
                id: '62178c4d4ecf221597654e3d',
                name: 'RSP-30 reactive signal cartridge (Red)',
                properties: {
                    defaultPreset: null,
                },
            },
            {
                id: '623063e994fc3f7b302a9696',
                name: 'HK G36 5.56x45 assault rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/6297738b9f1b474e440c45b5-grid-image.jpg',
                    },
                },
            },
            {
                id: '624c0b3340357b5f566e8766',
                name: 'RSP-30 reactive signal cartridge (Yellow)',
                properties: {
                    defaultPreset: null,
                },
            },
            {
                id: '624c2e8614da335f1e034d8c',
                name: 'Chiappa Rhino 200DS 9x19 revolver',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/624d7b2881a57812413b7954-grid-image.jpg',
                    },
                },
            },
            {
                id: '6259b864ebedf17603599e88',
                name: 'Benelli M3 Super 90 dual-mode 12ga shotgun',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/62975de85c32d414f8797433-grid-image.jpg',
                    },
                },
            },
            {
                id: '6275303a9f372d6ea97f9ec7',
                name: 'Milkor M32A1 MSGL 40mm grenade launcher',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/629744d002667c48a467e9f9-grid-image.jpg',
                    },
                },
            },
            {
                id: '627e14b21713922ded6f2c15',
                name: 'Accuracy International AXMC .338 LM bolt-action sniper rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/62973e474bb5ab23071c2a70-grid-image.jpg',
                    },
                },
            },
            {
                id: '628a60ae6b1d481ff772e9c8',
                name: 'Rifle Dynamics RD-704 7.62x39 assault rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/62972a7d91492d1a34152fbe-grid-image.jpg',
                    },
                },
            },
            {
                id: '628b5638ad252a16da6dd245',
                name: 'SAG AK-545 5.45x39 carbine',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/62971cf67af74c3ff577954b-grid-image.jpg',
                    },
                },
            },
            {
                id: '628b9c37a733087d0d7fe84b',
                name: 'SAG AK-545 Short 5.45x39 carbine',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/629711787af74c3ff577951d-grid-image.jpg',
                    },
                },
            },
            {
                id: '62e14904c2699c0ec93adc47',
                name: 'SR-2M "Veresk" 9x21 submachine gun',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/unknown-item-grid-image.jpg',
                    },
                },
            },
            {
                id: '62e7c4fba689e8c9c50dfc38',
                name: 'Steyr AUG A1 5.56x45 assault rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/unknown-item-grid-image.jpg',
                    },
                },
            },
            {
                id: '63088377b5cd696784087147',
                name: 'Glock 19X 9x19 pistol',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/unknown-item-grid-image.jpg',
                    },
                },
            },
            {
                id: '63171672192e68c5460cebc5',
                name: 'Steyr AUG A3 5.56x45 assault rifle',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/unknown-item-grid-image.jpg',
                    },
                },
            },
            {
                id: '633ec7c2a6918cb895019c6c',
                name: 'RSh-12 12.7x55 revolver',
                properties: {
                    defaultPreset: {
                        gridImageLink: 'https://assets.tarkov.dev/unknown-item-grid-image.jpg',
                    },
                },
            },
        ],
    },
};

const result = itemsFromTarkovDevApi
    .map((item) => {
        const dumpItem = latestDumpFromBsg[item.id]?._props;

        // item.gridImageLink = item.gridImageLink.replace('assets.tarkov.dev', 'eft-ammo.com/assets/game');

        if (item.types.includes('gun')) {
            item.gridImageLink = gunDataFromApi.data.items
                .find((x) => x.id === item.id)
                .properties.defaultPreset?.gridImageLink.replace('assets.tarkov.dev', 'eft-ammo.com/assets/game');
        }

        if (dumpItem) {
            item.equipmentSlots = dumpItem.Slots;

            if (dumpItem.defAmmo) {
                item.defAmmo = dumpItem.defAmmo;
            }
            if (dumpItem.InitialSpeed) {
                item.initialSpeed = dumpItem.InitialSpeed;
            }
            if (dumpItem.CenterOfImpact) {
                item.centerOfImpact = dumpItem.CenterOfImpact;
            }

            item.itemProperties = {};

            if (dumpItem.SightingRange) {
                item.itemProperties.sightingRange = dumpItem.SightingRange;
            }
            if (dumpItem.MaxDurability) {
                item.itemProperties.MaxDurability = dumpItem.MaxDurability;
            }
            if (dumpItem.Weight) {
                item.itemProperties.Weight = dumpItem.Weight;
            }
            if (dumpItem.Ergonomics) {
                item.itemProperties.Ergonomics = dumpItem.Ergonomics;
            }
            if (dumpItem.bFirerate) {
                item.itemProperties.bFirerate = dumpItem.bFirerate;
            }
            if (dumpItem.weapFireType) {
                item.itemProperties.weapFireType = dumpItem.weapFireType;
            }
            if (dumpItem.RecoilForceBack) {
                item.itemProperties.RecoilForceBack = dumpItem.RecoilForceBack;
            }
            if (dumpItem.RecoilForceUp) {
                item.itemProperties.RecoilForceUp = dumpItem.RecoilForceUp;
            }
            if (dumpItem.ammoCaliber) {
                item.itemProperties.ammoCaliber = dumpItem.ammoCaliber;
            }
            if (dumpItem.ConflictingItems) {
                item.itemProperties.ConflictingItems = dumpItem.ConflictingItems;
            }
            if (dumpItem.Velocity) {
                item.itemProperties.Velocity = dumpItem.Velocity;
            }
            if (dumpItem.Accuracy) {
                item.itemProperties.Accuracy = dumpItem.Accuracy;
            }
            if (dumpItem.Loudness) {
                item.itemProperties.Loudness = dumpItem.Loudness;
            }
            if (dumpItem.Chambers) {
                if (dumpItem.Chambers.length) {
                    item.allowedAmmoIds = dumpItem.Chambers[0]._props.filters[0].Filter;
                } else {
                    // e.g. 5ea03f7400685063ec28bfa8 aka PPSh-41 7.62x25 submachine gun has an empty array
                    item.allowedAmmoIds = [];
                }
            }
        }

        return item;
    })
    .filter((x) => !x.name.includes('signal cartridge') && !x.name.includes('flare cartridge'));

const fs = require('fs');
fs.writeFile('items.json', JSON.stringify(result), 'utf8', () => {});
console.log('Done!');
