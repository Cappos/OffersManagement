import gql from 'graphql-tag';

export default gql`
    {
        clients{
            _id
            contactPerson,
            companyName ,
            address,
            contactPhone,
            mobile,
            mail,
            webSite
            pib,
            tstamp
            offers {
                _id
                offerNumber
            }
        }
    }
`;
