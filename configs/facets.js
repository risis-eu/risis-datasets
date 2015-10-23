export default {
    facets: {
        'generic': {
            list: [
                'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
            ],
            config: {

            }
        },
        'http://rdf.risis.eu/dataset/risis/1.0/void.ttl#': {
            list: [
                'http://purl.org/dc/terms/subject', 'http://purl.org/dc/terms/language', 'http://purl.org/dc/terms/spatial', 'http://purl.org/dc/terms/contributor', 'http://purl.org/dc/terms/creator', 'http://purl.org/dc/terms/license', 'http://rdf.risis.eu/metadata/accessType', 'http://rdf.risis.eu/metadata/openingStatus', 'http://purl.org/dc/terms/format', 'http://www.w3.org/ns/dcat#byteSize', 'http://rdf.risis.eu/metadata/classification'
            ],
            config: {
                'http://purl.org/dc/terms/subject': {
                    label: ['Keywords']
                },
                'http://purl.org/dc/terms/language': {
                    label: ['Language'],
                    objectIViewer: ['LanguageView']
                },
                'http://purl.org/dc/terms/spatial': {
                    label: ['Geographical Coverage']
                },
                'http://purl.org/dc/terms/contributor': {
                    label: ['Contributor']
                },
                'http://purl.org/dc/terms/creator': {
                    label: ['Creator']
                },
                'http://purl.org/dc/terms/license': {
                    label: ['License'],
                    objectIViewer: ['BasicOptionView'],
                    options: [
                        {label: 'Open Data Commons Public Domain Dedication and License (PDDL)', value: 'http://www.opendatacommons.org/licenses/pddl/'},
                        {label: 'Open Data Commons Attribution License', value: 'http://www.opendatacommons.org/licenses/by/'},
                        {label: 'Open Data Commons Open Database License (ODbL)', value: 'http://www.opendatacommons.org/licenses/odbl/'},
                        {label: 'Creative Commons Public Domain Dedication', value: 'http://creativecommons.org/publicdomain/zero/1.0/'},
                        {label: 'Creative Commons Attribution-ShareAlike', value: 'http://creativecommons.org/licenses/by-sa/3.0/'},
                        {label: 'GNU Free Documentation License', value: 'http://www.gnu.org/copyleft/fdl.html'}
                    ]
                },
                'http://rdf.risis.eu/metadata/accessType': {
                    label: ['Access Type']
                },
                'http://rdf.risis.eu/metadata/openingStatus': {
                    label: ['Opening Status']
                },
                'http://purl.org/dc/terms/format': {
                    label: ['File Format']
                },
                'http://www.w3.org/ns/dcat#byteSize': {
                    label: ['Size'],
                    objectIViewer: ['FileSizeView']
                },
                'http://rdf.risis.eu/metadata/classification': {
                    label: ['Classification Scheme'],
                    objectIViewer: ['BasicOptionView'],
                    options: [
                        {label: 'Web of Science (WoS) categories', value: 'http://rdf.risis.eu/classifications/WoS/1.0/'},
                        {label: 'Field of Science (WoS) categories', value: 'http://rdf.risis.eu/classifications/FoS/1.0/'},
                        {label: 'IPC', value: 'http://rdf.risis.eu/classifications/IPC/1.0/'},
                        {label: 'UOE', value: 'http://rdf.risis.eu/classifications/UOE/1.0/'},
                        {label: 'EC-ATC', value: 'http://rdf.risis.eu/classifications/EC-ATC/1.0/'},
                        {label: 'NUTS', value: 'http://rdf.risis.eu/classifications/NUTS/1.0/'},
                        {label: 'ISO', value: 'http://rdf.risis.eu/classifications/ISO/1.0/'},
                        {label: 'CORDIS', value: 'http://rdf.risis.eu/classifications/CORDIS/1.0/'},
                        {label: 'ISCED', value: 'http://rdf.risis.eu/classifications/ISCED/1.0/'},
                        {label: 'NABS', value: 'http://rdf.risis.eu/classifications/NABS/1.0/'},
                        {label: 'NACE', value: 'http://rdf.risis.eu/classifications/NACE/1.0/'},
                        {label: 'ICB', value: 'http://rdf.risis.eu/classifications/ICB/1.0/'}
                    ],
                }
            }
        }
    }
};
