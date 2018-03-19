import gql from 'graphql-tag';

export default gql`
    {
        sealers{
            _id
            position
            name
            email
            phone
            mobile
            value
        }
    }
`;
