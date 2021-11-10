'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('./bookModel.js');

async function seed() {
    mongoose.connect(process.env.DB_URL);

    await Book.create({
        title: 'On the Road',
        description: 'On the Road is a 1957 novel by American writer Jack Kerouac, based on the travels of Kerouac and his friends across the United States. It is considered a defining work of the postwar Beat and Counterculture generations, with its protagonists living life against a backdrop of jazz, poetry, and drug use',
        author: 'Jack Kerouac',
        status: 'Read',
        email: 'minxie97@gmail.com'
    });
    console.log('On the Road by Jack Kerouac');

    await Book.create({
        title: 'A Clockwork Orange',
        description: 'A Clockwork Orange is a dystopian satirical black comedy novel by English writer Anthony Burgess, published in 1962. It is set in a near-future society that has a youth subculture of extreme violence.',
        author: 'Anthony Burgess',
        status: 'Read',
        email: 'minxie97@gmail.com'
    });
    console.log('A Clockwork Orange by Anthony Burgess');

    await Book.create({
        title: 'Kafka on the Shore',
        description: 'Kafka on the Shore is a 2002 novel by Japanese author Haruki Murakami. The book tells the stories of the young Kafka Tamura, a bookish 15-year-old boy who runs away from his Oedipal curse, and Satoru Nakata, an old, disabled man with the uncanny ability to talk to cats. The book incorporates themes of music as a communicative conduit, metaphysics, dreams, fate, the subconscious.',
        author: 'Haruki Murakami',
        status: 'Read',
        email: 'minxie97@gmail.com'
    });
    console.log('Kafka on the Shore by Haruki Murakami');

  mongoose.disconnect();

}

seed()