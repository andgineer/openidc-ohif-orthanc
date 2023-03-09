window.config = {
  // default: '/'
  routerBasename: '/',
  extensions: [],
  showStudyList: true,
  filterQueryParam: false,
  servers: {
    dicomWeb: [
      {
        name: 'Orthanc',
        wadoUriRoot: 'http://localhost/pacs/wado',
        qidoRoot: 'http://localhost/pacs/dicom-web',
        wadoRoot: 'http://localhost/pacs/dicom-web',
        qidoSupportsIncludeField: false,
        imageRendering: 'wadors',
        thumbnailRendering: 'wadors',
        enableStudyLazyLoad: true,
        supportsFuzzyMatching: true,
      },
    ],
  },
  whiteLabeling: {},
  // Extensions should be able to suggest default values for these?
  // Or we can require that these be explicitly set
  cornerstoneExtensionConfig: {},

  // studyListFunctionsEnabled is set to true to enable DICOM uploading
  studyListFunctionsEnabled: true,
  // Following property limits number of simultaneous series metadata requests.
  // For http/1.x-only servers, set this to 5 or less to improve
  //  on first meaningful display in viewer
  // If the server is particularly slow to respond to series metadata
  //  requests as it extracts the metadata from raw files everytime,
  //  try setting this to even lower value
  // Leave it undefined for no limit, sutiable for HTTP/2 enabled servers
  // maxConcurrentMetadataRequests: 5,
};
