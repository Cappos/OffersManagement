import gql from 'graphql-tag';

export default gql`
    {
        groups{
            _id
            name
            subTotal
            tstamp
            modules {
                _id
                name
                bodytext
                price
                tstamp
                cruserId
                moduleNew
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
    }
`;
