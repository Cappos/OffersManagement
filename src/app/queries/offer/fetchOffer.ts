import gql from 'graphql-tag';

export default gql`
    query fetchOffer( $id: ID!){
        offer(_id: $id) {
            _id
            offerNumber
            offerTitle
            bodytext
            totalPrice
            signedPrice
            tstamp
            expDate
            files
            signed
            internalHours
            externalHours
            sealer {
                _id
                name
                phone
                mobile
                email
                value
            }
            client {
                _id
                companyName
                contactPhone
                mobile
                mail
            }
            groups {
                _id
                name
                subTotal
                total
                tstamp
                type
                order
                modules {
                    _id
                    name
                    bodytext
                    price
                    tstamp
                    internalHours
                    externalHours
                    pricePerHour
                    signed
                    categoryId {
                        value
                        _id
                        name
                    }
                }
            }
            pages {
                _id
                type
                title
                subtitle
                bodytext
                tstamp
                order
            }
            
        }
        clients {
            _id
            companyName
        }
        sealers {
            _id
            name
            value
        }
    }
`;
