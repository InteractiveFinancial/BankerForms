 /**
  * Pacs028 form-specific functionality
 */

/**
* Pacs028 form-specific functionality
*/

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('bankingForm');
    if (!form) return;

    // Enhance the form submission for Pacs028 search
    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        // Get form elements for later use
        const submitButton = form.querySelector('button[type="submit"]');
        const resultContainer = document.getElementById('searchResults') ||
            createResultContainer();

        // Show loading state
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Searching...";
        }

        // Clear previous results
        resultContainer.innerHTML = '<div class="loading-spinner"></div>';
        resultContainer.style.display = 'block';

        // Get search parameters
        const searchParams = {
            messageId: document.getElementById('orgnlMsgId').value,
            messageNameId: document.getElementById('orgnlMsgNmId').value,
            endToEndId: document.getElementById('orgnlEndToEndId')?.value || '',
            creditorName: document.getElementById('creditorName')?.value || ''
        };

        try {
            // For demo mode, use a simulated response with a delay
            let result;

            if (window.location.hostname === 'localhost' ||
                window.location.hostname === '127.0.0.1' ||
                window.location.protocol === 'file:') {

                // In development/demo mode: simulate database response
                result = await simulateDbSearch(searchParams);
            } else {
                // In production: make actual database call
                result = await window.dbHandler.searchPaymentMessage(searchParams);
            }

            // Display the results
            displaySearchResults(result, resultContainer);

        } catch (error) {
            console.error('Search failed:', error);
            resultContainer.innerHTML = `
                <div class="error-panel">
                    <h3>Search Error</h3>
                    <p>Unable to complete your search. Please try again later.</p>
                    <p class="error-details">${error.message}</p>
                </div>
            `;
        } finally {
            // Restore button state
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Request Payment Status";
            }
        }
    });

    // Auto-populate message name ID field with the common value
    const msgNmIdField = document.getElementById('orgnlMsgNmId');
    if (msgNmIdField && !msgNmIdField.value) {
        msgNmIdField.value = 'pacs.008.001.08';
    }

    /**
     * Create container for search results if it doesn't exist
     */
    function createResultContainer() {
        const container = document.createElement('div');
        container.id = 'searchResults';
        container.className = 'search-results';
        form.parentNode.insertBefore(container, form.nextSibling);
        return container;
    }

    /**
     * Display search results in the container
     */
    function displaySearchResults(result, container) {
        if (!result || result.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <h3>No Results Found</h3>
                    <p>No payment message found matching your search criteria.</p>
                    <p>Please check the Message ID and Message Name ID and try again.</p>
                </div>
            `;
            return;
        }

        // Single result or array of results
        const payments = Array.isArray(result) ? result : [result];

        let html = `
            <div class="results-panel">
                <h3>Payment Status Results</h3>
                <div class="results-count">${payments.length} payment(s) found</div>
        `;

        payments.forEach(payment => {
            html += `
                <div class="payment-result">
                    <div class="result-header">
                        <span class="message-id">${payment.messageId}</span>
                        <span class="status ${payment.status.toLowerCase()}">${payment.statusDescription}</span>
                    </div>

                    <table class="payment-details">
                        <tr>
                            <th>Original Message ID:</th>
                            <td>${payment.messageId}</td>
                        </tr>
                        <tr>
                            <th>Status:</th>
                            <td>${payment.status} - ${payment.statusDescription}</td>
                        </tr>
                        <tr>
                            <th>Creditor:</th>
                            <td>${payment.creditorName}</td>
                        </tr>
                        <tr>
                            <th>Amount:</th>
                            <td>${payment.currency} ${payment.amount}</td>
                        </tr>
                        <tr>
                            <th>Date Created:</th>
                            <td>${payment.createdDate}</td>
                        </tr>
                    </table>

                    <div class="result-actions">
                        <button class="action-button"
                                onclick="window.open('Pacs028Report.html?id=${payment.messageId}', '_blank')">
                            View Full Report
                        </button>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        container.innerHTML = html;
    }

    /**
     * Simulate database search for testing/demo
     */
    async function simulateDbSearch(searchParams) {
        // Add artificial delay to simulate network request
        await new Promise(resolve => setTimeout(resolve, 1500));

        const { messageId, messageNameId } = searchParams;

        // Test data for demo purposes
        const testData = {
            "ABC123": {
                messageId: "ABC123",
                messageNameId: "pacs.008.001.08",
                status: "ACSP",
                statusDescription: "Accepted, Settlement in Process",
                creditorName: "ACME Corporation",
                debtorName: "John Smith",
                amount: "5,250.00",
                currency: "USD",
                createdDate: "2025-03-12T14:32:45",
                endToEndId: "E2E-ABC123-001"
            },
            "XYZ789": {
                messageId: "XYZ789",
                messageNameId: "pacs.008.001.08",
                status: "ACCC",
                statusDescription: "Accepted, Settlement Completed",
                creditorName: "Johnson & Partners Ltd",
                debtorName: "Alice Brown",
                amount: "12,750.00",
                currency: "USD",
                createdDate: "2025-03-10T09:15:22",
                endToEndId: "E2E-XYZ789-002"
            },
            "DEF456": {
                messageId: "DEF456",
                messageNameId: "pacs.008.001.08",
                status: "RJCT",
                statusDescription: "Rejected",
                creditorName: "Global Services Inc",
                debtorName: "Robert Taylor",
                amount: "3,825.50",
                currency: "USD",
                createdDate: "2025-03-13T16:45:10",
                endToEndId: "E2E-DEF456-003"
            }
        };

        // Check if we have a match in our test data
        if (messageId in testData) {
            // Simulated successful search
            return testData[messageId];
        }

        // Simulated no results
        return null;
    }
});

// document.addEventListener('DOMContentLoaded', function () {
//     const form = document.getElementById('bankingForm');
//     if (!form) return;

//     // Enhance the form submission for Pacs028 search
//     form.addEventListener('submit', function (event) {
//         event.preventDefault();

//         // Show loading state
//         const submitButton = form.querySelector('button[type="submit"]');
//         if (submitButton) {
//             submitButton.disabled = true;
//             submitButton.textContent = "Searching...";
//         }

//         // Get search parameters
//         const msgId = document.getElementById('orgnlMsgId').value;
//         const msgNmId = document.getElementById('orgnlMsgNmId').value;
//         const endToEndId = document.getElementById('orgnlEndToEndId')?.value || '';
//         const creditorName = document.getElementById('creditorName')?.value || '';

//         // Log search params for now (would connect to backend in production)
//         console.log("Searching for payment with parameters:", {
//             messageId: msgId,
//             messageNameId: msgNmId,
//             endToEndId: endToEndId,
//             creditorName: creditorName
//         });

//         // Simulate search delay
//         setTimeout(function () {
//             // In production, this would be a fetch() call to your API

//             // For demo purposes, show a result based on search criteria
//             if (msgId === "ABC123" && msgNmId === "pacs.008.001.08") {
//                 alert("Payment found! Status: ACSP (Accepted, Settlement in Process)");
//             } else {
//                 alert("No payment found matching these criteria. Please check and try again.");
//             }

//             // Reset button state
//             if (submitButton) {
//                 submitButton.disabled = false;
//                 submitButton.textContent = "Request Payment Status";
//             }
//         }, 1500);
//     });

//     // Auto-populate message name ID field with the common value
//     const msgNmIdField = document.getElementById('orgnlMsgNmId');
//     if (msgNmIdField && !msgNmIdField.value) {
//         msgNmIdField.value = 'pacs.008.001.08';
//     }
// });
