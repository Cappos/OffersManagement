import gql from 'graphql-tag';

export default gql`
    query fetchOffer( $id: ID!){
        offer(_id: $id) {
            _id
            offerNumber
            offerTitle
            bodytext
            totalPrice
            tstamp
            files
            sealer {
                _id
                name
                value
            }
            client {
                _id
                companyName
            }
            groups {
                _id
                name
                subTotal
                tstamp
                type
                order
                modules {
                    _id
                    name
                    bodytext
                    price
                    tstamp
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
