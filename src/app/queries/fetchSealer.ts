import gql from 'graphql-tag';

export default gql`
    {
        sealers{
            _id
            name
            email
            phone
            mobile
            value
        }
    }
`;
