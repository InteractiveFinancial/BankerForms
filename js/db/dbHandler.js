/**
 * Database Handler for Banking Forms
 * Manages connections and queries to the PostgreSQL database
 */

/**
 * Search for a payment message in the database
 * @param {Object} searchParams - Parameters to search by
 * @returns {Promise<Object>} - Promise resolving to search results
 */
async function searchPaymentMessage(searchParams) {
    const { messageId, messageNameId, endToEndId, creditorName } = searchParams;

    try {
        // In a real implementation, this would use a proper PostgreSQL client library
        // like 'pg' instead of this example fetch implementation
        const response = await fetch('/api/payment-search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messageId,
                messageNameId,
                endToEndId,
                creditorName
            })
        });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Database search error:', error);
        throw error; // Re-throw to let the caller handle it
    }
}

/**
 * For server-side implementation, this is how you would connect to PostgreSQL directly
 * Note: This code would run on the server, not in the browser
 */
/*
const { Pool } = require('pg');

// Connection configuration
const pool = new Pool({
    user: 'dbuser',
    host: 'database.server.com',
    database: 'payments',
    password: 'dbpassword',
    port: 5432,
});

async function searchPaymentMessageInDB(searchParams) {
    const { messageId, messageNameId, endToEndId, creditorName } = searchParams;

    // Build the query - using parameterized queries to prevent SQL injection
    let query = `
        SELECT * FROM payment_messages
        WHERE original_message_id = $1
        AND original_message_name_id = $2
    `;

    let params = [messageId, messageNameId];

    // Add optional parameters if provided
    if (endToEndId) {
        query += ` AND end_to_end_id = $${params.length + 1}`;
        params.push(endToEndId);
    }

    if (creditorName) {
        query += ` AND creditor_name ILIKE $${params.length + 1}`;
        params.push(`%${creditorName}%`); // ILIKE for case-insensitive search
    }

    try {
        const client = await pool.connect();
        try {
            const result = await client.query(query, params);
            return result.rows;
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Database error:', err);
        throw err;
    }
}
*/

// Export the functions
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = {
        searchPaymentMessage
    };
} else {
    // Browser environment
    window.dbHandler = {
        searchPaymentMessage
    };
}
