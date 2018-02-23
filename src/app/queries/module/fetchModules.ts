import gql from 'graphql-tag';

export default gql`
    {
        modules{
            _id
            name
            bodytext
            price
            tstamp
            moduleNew
            deleted
            internalHours
            externalHours
            pricePerHour
            categoryId {
                _id
                name
                value
            }
        }
    }
`;
