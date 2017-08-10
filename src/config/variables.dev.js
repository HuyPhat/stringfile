const DEV_VARIABLES = {
  API_SERVER: 'https://apistg.filestring.net/2.0/',
  FILE_SERVER: 'https://filestg.filestring.net/2.0/',
  LINKEDIN_CLIENT_ID: '75okkdsuwb96qz',
  LINKEDIN_CLIENT_SERECT: 'ONJsa7IEcSel02Ue',
  VERSION: '3.1.11',
  STAGE: 'staging',
  header_urls: [
    { name: 'Install', url: 'http://staging.filestring.modxcloud.com/install' },
    {
      name: 'Features',
      url: 'http://staging.filestring.modxcloud.com/features'
    },
    {
      name: 'Customers',
      url: 'http://staging.filestring.modxcloud.com/customers'
    },
    {
      name: 'Support',
      url: 'http://staging.filestring.modxcloud.com/support/',
      children: [
        {
          name: 'Privacy Policy',
          url: 'http://staging.filestring.modxcloud.com/privacy-policy'
        },
        {
          name: 'Terms of Service',
          url: 'http://staging.filestring.modxcloud.com/terms-of-service'
        },
        {
          name: 'Support Site',
          url: 'http://staging.filestring.modxcloud.com/support-site'
        }
      ]
    },
    {
      name: 'About',
      url: 'http://staging.filestring.modxcloud.com/about/',
      children: [
        {
          name: 'Overview',
          url: 'http://staging.filestring.modxcloud.com/overview'
        }
      ]
    }
  ]
};
export default DEV_VARIABLES;
