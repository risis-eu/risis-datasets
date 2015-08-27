export default {
    // config = scope + spec
    // scope is one the 15 combination of dataset, resource, property and object
    config: {
        //---------depth 1------------
        dataset: {
            'generic': {
                datasetReactor: ['Dataset'],
                resourceFocusType: ['http://rdfs.org/ns/void#Dataset'],
                maxNumberOfResourcesOnPage: 20,
                readOnly: 1
            },
            'http://rdf.risis.eu/sms/users.ttl#': {
                readOnly: 0,
                usePropertyCategories: 0,
                resourceReactor: ['ResourceUser']
            },
            'http://applications.risis.eu': {
                readOnly: 0,
                usePropertyCategories: 0
            }
        },
        resource: {
            'generic': {
                //if enabled, will categorize properties in different tabs based on property categories
                usePropertyCategories: 1,
                propertyCategories: ['overview', 'people', 'date', 'legalAspects', 'access', 'technicalAspects', 'structuralAspects'],
                //used when creating random resources
                dynamicResourceDomain: ['http://risis.eu'],
                resourceReactor: ['Resource']
            },
            'http://rdf.risis.eu/application/VisitRequestApplication': {
                treatAsResourceType: 1,
                resourceReactor: ['ResourceAppVisit']
            },
            'http://rdf.risis.eu/application/AccessRequestApplication': {
                treatAsResourceType: 1,
                resourceReactor: ['ResourceAppAccess']
            },
            'http://xmlns.com/foaf/0.1/Organization': {
                treatAsResourceType: 1,
                usePropertyCategories: 0

            },
            'http://xmlns.com/foaf/0.1/Person': {
                treatAsResourceType: 1,
                usePropertyCategories: 0
            },
            'http://rdf.risis.eu/metadata/Table': {
                treatAsResourceType: 1,
                usePropertyCategories: 0
            }
        },
        property: {
            'generic': {
                propertyReactor: ['IndividualProperty'],
                //following are object-based scope:
                objectReactor: ['IndividualObject'],
                //to view/edit individual object values
                objectIViewer: ['BasicIndividualView'],
                objectIEditor: ['BasicIndividualInput'],
                extendedOEditor: ['BasicIndividualDetailEdit'],
                extendedOViewer: ['BasicIndividualDetailView']
            },
            'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': {
                 //it will not affect the sub properties in detail
                 isHidden: 1,
                 category: ['overview'],
                 label: ['Type'],
                 hint: ['Type of the entity.']
             },
             'http://rdf.risis.eu/metadata/accessType': {
                  category: ['access'],
                  label: ['Access Type'],
                  hint: ['It can be visit only, request only or both request and visit.'],
                  objectIEditor: ['BasicOptionInput'],
                  options: [
                      {label: 'Access and Visit', value: 'Access and Visit'},
                      {label: 'Access Only', value: 'Access Only'},
                      {label: 'Visit Only', value: 'Visit Only'}
                  ]
              },
             'http://rdf.risis.eu/metadata/openingStatus': {
                  category: ['access'],
                  label: ['Opening Status'],
                  hint: ['Wheter the dataset is already open or will be open soon.'],
                  objectIEditor: ['BasicOptionInput'],
                  options: [
                      {label: 'Opening Soon', value: 'Opening Soon'},
                      {label: 'Open', value: 'Open'}
                  ]
              },
             'http://rdf.risis.eu/metadata/accessRequestForm': {
                  category: ['access'],
                  label: ['Access Request Conditions and Details'],
                  hint: ['Link to the form that provides information for end users to access the dataset.']
              },
             'http://rdf.risis.eu/metadata/visitRequestForm': {
                  category: ['access'],
                  label: ['Visit Request Conditions and Details'],
                  hint: ['Link to the form that provides information for end users to visit the dataset.']
              },
             'http://rdf.risis.eu/metadata/nonDisclosureAgreement': {
                  category: ['access'],
                  label: ['Non-disclosure Agreement Form'],
                  hint: ['In order to access confidential data, users have to sign a non-disclosure agreement with the holders of the dataset. The link to this form should be set here.']
              },
             'http://rdf.risis.eu/metadata/dataModel': {
                 category: ['structuralAspects'],
                 label: ['Data Model'],
                 hint: ['The underlying data model. Whether it is RDF, Relational, etc. Add your own model if not exists in the option list.'],
                 allowNewValue: 1,
                 objectIViewer: ['BasicOptionView'],
                 objectIEditor: ['BasicOptionInput'],
                 options: [
                     {label: 'Relational Model', value: 'Relational Model'},
                     {label: 'RDF Model', value: 'RDF Model'},
                     {label: 'Tabular (Spreadsheet) Model', value: 'Tabular Model'},
                     {label: 'Unstructured', value: 'Unstructured'}
                 ],
                 placeholder: ["Enter the value for other data model..."],
                 defaultValue: ['Relational Model'],
                 allowUserDefinedValue: 1
             },
             'http://rdf.risis.eu/metadata/classification': {
                category: ['structuralAspects'],
                label: ['Classification Scheme'],
                hint: ['What classifications are used?'],
                allowNewValue: 1,
                objectIViewer: ['BasicOptionView'],
                objectIEditor: ['BasicOptionInput'],
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
                placeholder: ["Enter the URI for your classification..."],
                allowUserDefinedValue: 1
            },
            'http://rdf.risis.eu/metadata/tables': {
                category: ['structuralAspects'],
                label: ['Total Number of Tables'],
                hint: ['The total number of distinct tables in the dataset.'],
                placeholder: ["Enter the number of tables..."]
            },
            'http://rdfs.org/ns/void#classes': {
                category: ['structuralAspects'],
                label: ['Total Number of Entity Types'],
                hint: ['The total number of distinct entity types (classes) in the dataset.'],
                placeholder: ["Enter the number of entity types..."]
            },
            'http://rdf.risis.eu/metadata/table': {
                category: ['structuralAspects'],
                label: ['Tables'],
                hint: ['The specification of tables in your dataset.'],
                allowNewValue: 1,
                allowExtension: 1,
                hasBlankNode: 1,
                extensions: [
                    {
                        spec: {
                            propertyURI: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                            instances: [{value: 'http://rdf.risis.eu/metadata/Table', valueType: 'uri'}]
                        },
                        config: {
                            label: ['Type'],
                            category: ['structuralAspects'],
                            objectIViewer: ['BasicOptionView'],
                            objectIEditor: ['BasicOptionInput'],
                            options: [
                                {label: 'Table', value: 'http://rdf.risis.eu/metadata/Table'},
                            ],
                        }
                    },
                    {
                        spec: {
                            propertyURI: 'http://xmlns.com/foaf/0.1/name',
                            instances: [{value: '', valueType: 'literal'}]
                        },
                        config: {
                            label: ['Table Name'],
                            category: ['structuralAspects'],
                        }
                    },
                    {
                        spec: {
                            propertyURI: 'http://purl.org/dc/terms/description',
                            instances: [{value: '', valueType: 'literal'}]
                        },
                        config: {
                            label: ['Description'],
                            objectIEditor: ['BasicTextareaInput'],
                            category: ['structuralAspects']
                        }
                    },
                    {
                        spec: {
                            propertyURI: 'http://rdf.risis.eu/metadata/records',
                            instances: [{value: '', valueType: 'literal'}]
                        },
                        config: {
                            label: ['Total Number of Records'],
                            category: ['structuralAspects'],
                            placeholder: ['Enter the total number of records...']
                        }
                    },
                    {
                        spec: {
                            propertyURI: 'http://rdf.risis.eu/metadata/attributes',
                            instances: [{value: '', valueType: 'literal'}]
                        },
                        config: {
                            label: ['Total Number of Attributes'],
                            category: ['structuralAspects'],
                            placeholder: ['Enter the total number of attributes...']
                        }
                    },
                    {
                        spec: {
                            propertyURI: 'http://rdf.risis.eu/metadata/attribute',
                            instances: [{value: '', valueType: 'literal'}]
                        },
                        config: {
                            label: ['Attributes'],
                            category: ['structuralAspects'],
                            placeholder: ['Enter the attribute name...'],
                            allowNewValue: 1
                        }
                    }
                ]
            },
            'http://rdfs.org/ns/void#class': {
                category: ['structuralAspects'],
                label: ['Entity Types'],
                hint: ['The specification of entity types in your dataset.'],
                allowNewValue: 1,
                allowExtension: 1,
                hasBlankNode: 1,
                extensions: [
                    {
                        spec: {
                            propertyURI: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                            instances: [{value: 'http://xmlns.com/foaf/0.1/Person', valueType: 'uri'}]
                        },
                        config: {
                            label: ['Type'],
                            objectIViewer: ['BasicOptionView'],
                            objectIEditor: ['BasicOptionInput'],
                            category: ['structuralAspects'],
                            options: [
                                {label: 'Person', value: 'http://xmlns.com/foaf/0.1/Person'},
                                {label: 'Organization', value: 'http://xmlns.com/foaf/0.1/Organization'},
                                {label: 'Higher Education Institution', value: 'http://purl.org/vocab/aiiso/schema#Institution'},
                                {label: 'Firm', value: 'http://rdf.risis.eu/metadata/Firm'},
                                {label: 'Funding Body', value: 'http://vivoweb.org/ontology/core#FundingOrganization'},
                                {label: 'Publication', value: 'http://purl.org/cerif/frapo/Publication'},
                                {label: 'Patent', value: 'http://purl.org/ontology/bibo/Patent'},
                                {label: 'Project', value: 'http://purl.org/cerif/frapo/Project'},
                                {label: 'Investment', value: 'http://purl.org/cerif/frapo/Investment'},
                                {label: 'FundingProgramme', value: 'http://purl.org/cerif/frapo/FundingProgramme'},
                                {label: 'Policy', value: 'http://purl.org/dc/terms/Policy'},
                                {label: 'Policy Evaluation', value: 'http://rdf.risis.eu/metadata/PolicyEvaluation'}
                            ],
                            placeholder: ["Enter the URI for your specific entity type..."],
                            allowUserDefinedValue: 1
                        }
                    },
                    {
                        spec: {
                            propertyURI: 'http://purl.org/dc/terms/description',
                            instances: [{value: '', valueType: 'literal'}]
                        },
                        config: {
                            label: ['Description'],
                            category: ['structuralAspects'],
                            objectIEditor: ['BasicTextareaInput']
                        }
                    },
                    {
                        spec: {
                            propertyURI: 'http://rdfs.org/ns/void#property',
                            instances: [{value: '', valueType: 'literal'}]
                        },
                        config: {
                            category: ['structuralAspects'],
                            label: ['Attributes']
                        }
                    },
                    {
                        spec: {
                            propertyURI: 'http://purl.org/dc/terms/temporal',
                            instances: [{value: 'http://example.org/temporal', valueType: 'uri'}]
                        },
                        config: {
                            category: ['structuralAspects'],
                            label: ['Time Coverage'],
                            hasBlankNode: 1,
                            autoLoadDetails: 1,
                            allowExtension: 1,
                            extensions: [
                                {
                                    spec: {
                                        propertyURI: 'http://rdf-vocabulary.ddialliance.org/discovery#startDate',
                                        instances: [{value: '2010-12-24', valueType: 'literal'}]
                                    },
                                    config: {
                                        label: ['Start date'],
                                        category: ['date'],
                                        hint: ['Start date of the time coverage.']
                                    }
                                },
                                {
                                    spec: {
                                        propertyURI: 'http://rdf-vocabulary.ddialliance.org/discovery#endDate',
                                        instances: [{value: '2015-12-24', valueType: 'literal'}]
                                    },
                                    config: {
                                        label: ['End date'],
                                        category: ['date'],
                                        hint: ['End date of the time coverage.']
                                    }
                                }
                            ]
                        }
                    },
                    {
                        spec: {
                            propertyURI: 'http://purl.org/dc/terms/spatial',
                            instances: [{value: 'http://dbpedia.org/resource/Germany', valueType: 'uri'}]
                        },
                        config: {
                            category: ['structuralAspects'],
                            label: ['Geographical Coverage'],
                            allowNewValue: 1,
                            objectReactor: ['AggregateObject'],
                            objectAViewer: ['DBpediaGoogleMapView'],
                            objectIViewer: ['BasicDBpediaView'],
                            asWikipedia: 1,
                            objectIEditor: ['DBpediaInput'],
                            lookupClass: ['Place']
                        }
                    },
                ]
            },
            'http://purl.org/dc/terms/title': {
                label: ['Title'],
                category: ['overview'],
                hint: ['The title of the dataset described by this document.'],
                objectIViewer: ['BasicIndividualView'],
                objectIEditor: ['BasicIndividualInput']
            },
            'http://purl.org/dc/terms/language': {
                allowNewValue: 1,
                label: ['Dataset Language'],
                category: ['overview'],
                hint: ['The language of the dataset. Resources defined by the Library of Congress (http://id.loc.gov/vocabulary/iso639-1.html, http://id.loc.gov/vocabulary/iso639-2.html) SHOULD be used.'],
                objectIViewer: ['LanguageView'],
                objectIEditor: ['LanguageInput'],
                defaultValue: ['http://id.loc.gov/vocabulary/iso639-1/en']
            },
            'http://purl.org/dc/terms/temporal': {
                label: ['Time coverage'],
                category: ['date'],
                hint: ['Time coverage of the data itself but not of the data collection. For example we collect pictures in 2015 about the war. However, the pictures themselves could have been taken from 1939 to 1945. So the time coverage is 1939-1945.'],
                allowExtension: 1,
                hasBlankNode: 1,
                autoLoadDetails: 1,
                extensions: [
                    {
                        spec: {
                            propertyURI: 'http://rdf-vocabulary.ddialliance.org/discovery#startDate',
                            instances: [{value: '2010-12-24', valueType: 'literal'}]
                        },
                        config: {
                            label: ['Start date'],
                            category: ['date'],
                            hint: ['Start date of the time coverage.']
                        }
                    },
                    {
                        spec: {
                            propertyURI: 'http://rdf-vocabulary.ddialliance.org/discovery#endDate',
                            instances: [{value: '2015-12-24', valueType: 'literal'}]
                        },
                        config: {
                            label: ['End date'],
                            category: ['date'],
                            hint: ['End date of the time coverage.']
                        }
                    }
                ]
            },
            'http://purl.org/dc/terms/spatial': {
                label: ['Geographical coverage'],
                category: ['overview'],
                hint: ['The geographical area covered by the dataset.The same metadata could also be used to document the geographical area covered by an entity contained in the dataset in particular. For example we could say that the dataset covers all Eu countries or covers only France and Italy.'],
                allowNewValue: 1,
                objectReactor: ['AggregateObject'],
                objectAViewer: ['DBpediaGoogleMapView'],
                objectIViewer: ['BasicDBpediaView'],
                asWikipedia: 1,
                objectAEditor: ['BasicAggregateInput'],
                objectIEditor: ['DBpediaInput'],
                lookupClass: ['Place']
            },
            'http://purl.org/dc/terms/description': {
                category: ['overview'],
                label: ['Textual description'],
                hint: ['A textual description of the dataset.'],
                objectIEditor: ['BasicTextareaInput']
            },
            'http://purl.org/dc/terms/subject': {
                category: ['overview'],
                label: ['Keywords'],
                hint: ['Tags a dataset with a topic. For the general case, we recommend the use of a DBpedia resource URI (http://dbpedia.org/resource/XXX) to categorise a dataset, where XXX stands for the thing which best describes the main topic of what the dataset is about.'],
                allowNewValue: 1,
                objectIEditor: ['DBpediaInput'],
                objectIViewer: ['BasicDBpediaView'],
                asWikipedia: 1
            },
            'http://purl.org/dc/terms/source': {
                label: ['Data Source'],
                allowNewValue: 1,
                category: ['overview'],
                hint: ['A related resource from which the dataset is derived. The source should be described using a URI if available, rather than as a literal.']
            },
            'http://purl.org/dc/terms/creator': {
                allowNewValue: 1,
                allowExtension: 1,
                category: ['people'],
                label: ['Creator'],
                hint: ['An entity, such as a person, organisation, or service, that is primarily responsible for creating the dataset. The creator should be described using a URI if available, rather than just providing the name as a literal. ORCID provides a useful service for this.'],
                objectIEditor: ['DBpediaInput'],
                objectIViewer: ['BasicDBpediaView'],
                asWikipedia: 1,
                extensions: [
                    {
                        spec: {
                            propertyURI: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                            instances: [{value: 'http://xmlns.com/foaf/0.1/Person', valueType: 'uri'}]
                        },
                        config: {
                            hint: ['Type of the entity'],
                            label: ['Type'],
                            category: ['people'],
                            objectIViewer: ['BasicOptionView'],
                            objectIEditor: ['BasicOptionInput'],
                            options: [
                                {label: 'Person', value: 'http://xmlns.com/foaf/0.1/Person'},
                                {label: 'Organization', value: 'http://xmlns.com/foaf/0.1/Organization'}
                            ],
                            defaultValue: ['http://xmlns.com/foaf/0.1/Person'],
                            allowUserDefinedValue: 1,
                            isHidden: 0
                        }
                    },
                    {
                        spec: {
                            propertyURI: 'http://www.w3.org/2000/01/rdf-schema#label',
                            instances: [{value: 'Label', valueType: 'literal'}]
                        },
                        config: {
                            hint: ['A descriptor label for the URI'],
                            category: ['people'],
                            label: ['Label']
                        }
                    },
                    {
                        spec: {
                            propertyURI: 'http://xmlns.com/foaf/0.1/mbox',
                            instances: [{value: 'email address', valueType: 'literal'}]
                        },
                        config: {
                            hint: ['A corresponding email address'],
                            category: ['people'],
                            label: ['Email']
                        }
                    }
                ]
            },
            'http://purl.org/dc/terms/publisher': {
                allowNewValue: 1,
                allowExtension: 1,
                category: ['people'],
                label: ['Publisher'],
                hint: ['An entity, such as a person, organisation, or service, that is responsible for making the dataset available. The publisher should be described using a URI if available, rather than just providing the name as a literal.'],
                objectIEditor: ['DBpediaInput'],
                objectIViewer: ['BasicDBpediaView'],
                asWikipedia: 1,
                extensions: [
                    {
                        spec: {
                            propertyURI: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                            instances: [{value: 'http://xmlns.com/foaf/0.1/Person', valueType: 'uri'}]
                        },
                        config: {
                            hint: ['Type of the entity'],
                            category: ['people'],
                            label: ['Type'],
                            objectIViewer: ['BasicOptionView'],
                            objectIEditor: ['BasicOptionInput'],
                            options: [
                                {label: 'Person', value: 'http://xmlns.com/foaf/0.1/Person'},
                                {label: 'Organization', value: 'http://xmlns.com/foaf/0.1/Organization'}
                            ],
                            defaultValue: ['http://xmlns.com/foaf/0.1/Person'],
                            allowUserDefinedValue: 1,
                            isHidden: 0
                        }
                    },
                    {
                        spec: {
                            propertyURI: 'http://www.w3.org/2000/01/rdf-schema#label',
                            instances: [{value: 'Label', valueType: 'literal'}]
                        },
                        config: {
                            hint: ['A descriptor label for the URI'],
                            category: ['people'],
                            label: ['Label']
                        }
                    },
                    {
                        spec: {
                            propertyURI: 'http://xmlns.com/foaf/0.1/mbox',
                            instances: [{value: 'email address', valueType: 'literal'}]
                        },
                        config: {
                            hint: ['A corresponding email address'],
                            category: ['people'],
                            label: ['Email']
                        }
                    }
                ]
            },
            'http://purl.org/dc/terms/contributor': {
                allowNewValue: 1,
                allowExtension: 1,
                category: ['people'],
                label: ['Contributor'],
                hint: ['An entity, such as a person, organisation, or service, that is responsible for making contributions to the dataset. The contributor should be described using a URI if available, rather than just providing the name as a literal.'],
                objectIEditor: ['DBpediaInput'],
                objectIViewer: ['BasicDBpediaView'],
                asWikipedia: 1,
                extensions: [
                    {
                        spec: {
                            propertyURI: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
                            instances: [{value: 'http://xmlns.com/foaf/0.1/Person', valueType: 'uri'}]
                        },
                        config: {
                            hint: ['Type of the entity'],
                            category: ['people'],
                            label: ['Type'],
                            objectIViewer: ['BasicOptionView'],
                            objectIEditor: ['BasicOptionInput'],
                            options: [
                                {label: 'Person', value: 'http://xmlns.com/foaf/0.1/Person'},
                                {label: 'Organization', value: 'http://xmlns.com/foaf/0.1/Organization'}
                            ],
                            defaultValue: ['http://xmlns.com/foaf/0.1/Person'],
                            allowUserDefinedValue: 1,
                            isHidden: 0
                        }
                    },
                    {
                        spec: {
                            propertyURI: 'http://www.w3.org/2000/01/rdf-schema#label',
                            instances: [{value: 'Label', valueType: 'literal'}]
                        },
                        config: {
                            hint: ['A descriptor label for the URI'],
                            category: ['people'],
                            label: ['Label']
                        }
                    },
                    {
                        spec: {
                            propertyURI: 'http://xmlns.com/foaf/0.1/mbox',
                            instances: [{value: 'email address', valueType: 'literal'}]
                        },
                        config: {
                            hint: ['A corresponding email address'],
                            category: ['people'],
                            label: ['Email']
                        }
                    }
                ]
            },
            'http://purl.org/dc/terms/created': {
                label: ['Created date'],
                category: ['date'],
                hint: ['A point or period of time associated with an event in the life-cycle of the resource. The value should be formatted as date and time format - ISO 8601']
            },
            'http://purl.org/dc/terms/issued': {
                label: ['Date issued'],
                category: ['date'],
                hint: ['A point or period of time associated with an event in the life-cycle of the resource. The value should be formatted as date and time format - ISO 8601.']
            },
            'http://purl.org/dc/terms/modified': {
                label: ['Date modified'],
                category: ['date'],
                hint: ['A point or period of time associated with an event in the life-cycle of the resource. The value should be formatted as date and time format - ISO 8601']
            },
            'http://purl.org/dc/terms/license': {
                category: ['legalAspects'],
                label: ['License'],
                hint: ['Data without explicit license is a potential legal liability and leaves consumers unclear what the usage conditions are. Therefore, it is very important that publishers make explicit the terms under which the dataset can be used.'],
                allowNewValue: 1,
                objectIViewer: ['BasicOptionView'],
                objectIEditor: ['BasicOptionInput'],
                options: [
                    {label: 'Open Data Commons Public Domain Dedication and License (PDDL)', value: 'http://www.opendatacommons.org/licenses/pddl/'},
                    {label: 'Open Data Commons Attribution License', value: 'http://www.opendatacommons.org/licenses/by/'},
                    {label: 'Open Data Commons Open Database License (ODbL)', value: 'http://www.opendatacommons.org/licenses/odbl/'},
                    {label: 'Creative Commons Public Domain Dedication', value: 'http://creativecommons.org/publicdomain/zero/1.0/'},
                    {label: 'Creative Commons Attribution-ShareAlike', value: 'http://creativecommons.org/licenses/by-sa/3.0/'},
                    {label: 'GNU Free Documentation License', value: 'http://www.gnu.org/copyleft/fdl.html'}
                ],
                defaultValue: ['http://creativecommons.org/licenses/by-sa/3.0/'],
                allowUserDefinedValue: 1
            },
            'http://purl.org/dc/terms/rights': {
                label: ['Rights'],
                category: ['legalAspects'],
                hint: ['This describes the rights under which the dataset can be used/reused.']
            },
            'http://purl.org/dc/terms/format': {
                label: ['Dataset File format'],
                allowNewValue: 1,
                category: ['technicalAspects'],
                hint: ['Technical features of a dataset.'],
                objectIEditor: ['MediaTypeInput'],
                allowUserDefinedValue: 1
            },
            'http://rdfs.org/ns/void#dataDump': {
                label: ['Download address'],
                category: ['technicalAspects'],
                hint: ['If the dataset is available, then its location can be announced using this attribute. If the dataset is split into multiple dumps, then several values of this property can be provided.']
            },
            'http://rdfs.org/ns/void#exampleResource': {
                label: ['Example of the resource'],
                category: ['overview'],
                hint: ['For documentation purposes, it can be helpful to name some representative example entities for a dataset. Looking up these entities allows users to quickly get an impression of the kind of data that is present in a dataset.'],
                allowNewValue: 1
            },
            'http://rdfs.org/ns/void#vocabulary': {
                isHidden: 1,
                label: ['Vocabulary'],
                category: ['overview'],
                hint: ['Vocabularies used in the dataset.']
            },
            'http://www.w3.org/ns/dcat#byteSize': {
                label: ['Size of the dataset'],
                category: ['technicalAspects'],
                hint: ['The size of the dataset. For example we could say that the dataset is 1.0 GB or 1024.0 MB'],
                objectIEditor: ['FileSizeInput'],
                objectIViewer: ['FileSizeView']
            },
            'http://www.w3.org/ns/dcat#accessURL': {
                label: ['Access URL'],
                category: ['access'],
                hint: ['A landing page, feed, SPARQL endpoint or other type of resource that gives access to the distribution of the dataset'],
                allowNewValue: 1
            },
            'http://xmlns.com/foaf/0.1/homepage': {
                label: ['Home Page'],
                category: ['overview'],
                hint: ['Web page where further information about the dataset can be found.']
            },
            'http://xmlns.com/foaf/0.1/page': {
                label: ['Additional web pages'],
                category: ['overview'],
                hint: ['Additional web pages with relevant information that can not be considered the homepage of the dataset.'],
                allowNewValue: 1
            },
            'http://vocab.org/waiver/terms/norms': {
                label: ['Terms of use'],
                category: ['legalAspects'],
                hint: ['Norms are non-binding conditions of use that publishers would like to encourage the users of their data to adopt. representing the community norms for access and use of a resource.']
            },
            'http://vocab.org/waiver/terms/waiver': {
                label: ['Waiver'],
                category: ['legalAspects'],
                hint: ['To the extent possible under law, The Example Organisation has waived all copyright and related or neighboring rights to The Example Dataset.'],
                objectIEditor: ['BasicTextareaInput']
            },
            'http://purl.org/pav/version': {
                isHidden: 1,
                label: ['Version'],
                category: ['overview'],
                hint: ['The version of the dataset described by this document']
            }
        },
        //property value = object
        object: {
            'generic': {

            }
        },
        //---------depth 2------------
        dataset_resource: {

        },
        dataset_property: {
            'http://applications.risis.eu': {
                'http://rdf.risis.eu/application/dataset': {
                    label: ['Dataset']
                },
                'http://rdf.risis.eu/application/status': {
                    label: ['Status'],
                    objectIEditor: ['BasicOptionInput'],
                    options: [
                        {label: 'submitted', value: 'submitted'},
                        {label: 'approved', value: 'approved'},
                        {label: 'rejected', value: 'rejected'}
                    ]
                },
                'http://rdf.risis.eu/application/applicant': {
                    label: ['Applicant'],
                    hint: ['Click on link to see applicant details.'],
                    objectIViewer: ['BasicLinkedIndividualView'],
                    linkedGraph: ['http://rdf.risis.eu/sms/users.ttl#']
                },
                'http://rdf.risis.eu/application/cvAnnex': {
                    label: ['Applicant CV'],
                    objectIViewer: ['UploadedView']
                },
                'http://rdf.risis.eu/application/projectDescAnnex': {
                    label: ['Project Description Annex'],
                    objectIViewer: ['UploadedView']
                },
                'http://rdf.risis.eu/application/ndaForm': {
                    label: ['Signed Non-disclosure Agreement'],
                    objectIViewer: ['UploadedView']
                },
                'http://rdf.risis.eu/application/technicalSpecification': {
                    label: ['Technical specifications (format, etc.)']
                },
                'http://rdf.risis.eu/application/purposeOfUse': {
                    label: ['Specification of purpose of use']
                },
                'http://rdf.risis.eu/application/dataRequested': {
                    label: ['Data requested (type of data, year, etc.)']
                },
                'http://rdf.risis.eu/application/projectTitle': {
                    label: ['Project Title']
                },
                'http://rdf.risis.eu/application/projectSummary': {
                    label: ['Project Summary']
                },
                'http://rdf.risis.eu/application/hostingLocation': {
                    label: ['Hosting Location']
                },
                'http://rdf.risis.eu/application/prefferedVisitDates': {
                    label: ['Preferred Dates for Visit']
                },
                'http://rdf.risis.eu/application/visitDuration': {
                    label: ['Duration (days)']
                },
                'http://rdf.risis.eu/application/travelBudget': {
                    label: ['Travel Budget']
                },
                'http://rdf.risis.eu/application/accommodationBudget': {
                    label: ['Accommodation Budget']
                },
                'http://rdf.risis.eu/application/totalBudget': {
                    label: ['Total Budget']
                },
                'http://rdf.risis.eu/application/budgetRemarks': {
                    label: ['Remarks to Budget']
                },
                'http://rdf.risis.eu/application/commentOnDecision': {
                    label: ['Comments on Decision'],
                    objectIEditor: ['BasicTextareaInput']
                }
            },
            'http://rdf.risis.eu/sms/users.ttl#': {
                'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': {
                    isHidden: 1
                },
                'http://xmlns.com/foaf/0.1/accountName': {
                    label: ['Username'],
                    readOnly: 1
                },
                'http://xmlns.com/foaf/0.1/firstName': {
                    label: ['First Name']
                },
                'http://xmlns.com/foaf/0.1/lastName': {
                    label: ['Last Name']
                },
                'http://xmlns.com/foaf/0.1/mbox': {
                    label: ['Email Address'],
                    readOnly: 1
                },
                'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#password': {
                    label: ['Password'],
                    objectIViewer: ['PasswordView'],
                    objectIEditor: ['PasswordInput']
                },
                'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#editorOfGraph': {
                    label: ['Editor of Graph'],
                    allowNewValue: 1
                },
                'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#editorOfResource': {
                    label: ['Editor of Resource'],
                    allowNewValue: 1
                },
                'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#editorOfProperty': {
                    label: ['Editor of Property'],
                    allowNewValue: 1,
                    allowExtension: 1,
                    hasBlankNode: 1,
                    autoLoadDetails: 1,
                    extensions: [
                        {
                            spec: {
                                propertyURI: 'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#resource',
                                instances: [{value: 'http://exampleResource.org', valueType: 'uri'}]
                            },
                            config: {
                                hint: ['Resource URI under which the property is exposed.'],
                                label: ['Resource']
                            }
                        },
                        {
                            spec: {
                                propertyURI: 'https://github.com/ali1k/ld-reactor/blob/master/vocabulary/index.ttl#property',
                                instances: [{value: 'http://exampleProperty.org', valueType: 'uri'}]
                            },
                            config: {
                                hint: ['Property URI'],
                                label: ['Property']
                            }
                        }
                    ]
                },
                'http://xmlns.com/foaf/0.1/organization': {
                    label: ['Organization'],
                    allowNewValue: 1,
                    objectIViewer: ['BasicDBpediaView'],
                    asWikipedia: 1,
                    objectIEditor: ['DBpediaInput']
                },
                'http://www.w3.org/2001/vcard-rdf/3.0#ROLE': {
                    label: ['Position'],
                    hint: ['Position/Role in the organization. E.g. professor, lecturer, phd student, post doc, researcher, other...']
                },
                'http://www.w3.org/2001/vcard-rdf/3.0#adr': {
                    label: ['Postal Address'],
                    objectIEditor: ['BasicTextareaInput'],
                    hint: ['Full address of institutional affiliation']
                }
            }
        },
        dataset_object: {

        },
        resource_property: {

        },
        resource_object: {

        },
        property_object: {

        },
        //---------depth 3------------
        dataset_resource_property: {

        },
        dataset_resource_object: {

        },
        dataset_property_object: {

        },
        resource_property_object: {

        },
        //---------depth 4------------
        dataset_resource_property_object: {

        }
    }
};
