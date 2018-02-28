import gql from 'graphql-tag';

export default gql`
    query fetchClient( $id: ID!){
        client (id: $id){
            _id,
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
                offerTitle
                tstamp
            }
        }
    }
`;
