import gql from 'graphql-tag';

export default gql`
    {
        module{
            _id
            name
            bodytext
            price
            tstamp
        }
    }
`;
