// In your API endpoint
app.post('/api/create-pacs028', async (req, res) => {
    try {
        const { orgnlMsgId, orgnlMsgNmId } = req.body;

        // 1. Fetch just the specific fields needed from Pacs008
        const query = `
      SELECT
        orgnlMsgId,
        orgnlMsgNmId.
        orgnlCreDtTm,
        orgnlInstrId,
        orgnlEndToEndId,
        orgnlUETR,
        instgAgtMmbId,
        instgAgtClrSysId,
        instdAgtMmbId,
        instdAgtClrSysId,
    `;

        const result = await pool.query(query, [orgnlMsgId, orgnlMsgNmId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Original payment message not found' });
        }

        const pacs008Data = result.rows[0];

        // 2. Use the extracted fields to create a Pacs028. ADD HEADER INFO.
        const pacs028Result = await createAndSendPacs028({
            messageId: generateNewMessageId(), 
            messageNameId: 'pacs.028.001.01',
            creationDateTime:generateNewCreDtTm(),
            originalMessageId: pacs008Data.orgnlMsgId,
            originalMessageNameId: pacs008Data.orgnlMsgNmId,
            originalCreationDateTime: pacs008Data.orgnlCreDtTm,
            originalInstructionId: pacs008Data.orgnlInstrId,
            originalEndToEndId: pacs008Data.orgnlEndToEndId,
            originalUETR: pacs008Data.orgnlUETR,
            instructingAgentMemberId: pacs008Data.instgAgtMmbId,
            instructingAgentClearingSystemId: pacs008Data.instgAgtClrSysId,
            instructedAgentMemberId: pacs008Data.instdAgtMmbId,
            instructedAgentClearingSystemId: pacs008Data.instdAgtClrSysId,

        });

        // 3. Return success response
        return res.json({
            success: true,
            pacs028MessageId: pacs028Result.messageId,
            sentTimestamp: new Date()
        });

    } catch (error) {
        console.error('Error creating Pacs028:', error);
        return res.status(500).json({ error: 'Failed to create Pacs028 message' });
    }
});

// This function would call your existing method for creating Pacs028
async function createAndSendPacs028(data) {
    // Call your existing Pacs028 creation method with the extracted data
    // This is where your existing logic would be used
    return {
        messageId: 'P028-' + Date.now(),
        // Other return values
    };
}
