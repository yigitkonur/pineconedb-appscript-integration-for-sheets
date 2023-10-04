// Define your API keys here
const OPENAI_API_KEY = 'Your-OpenAI-API-Key';
const PINECONE_API_KEY = 'Your-Pinecone-API-Key';

/**
 * A Google Apps Script custom function that fetches the most similar categories 
 * to a given keyword from a vector database. It uses the OpenAI API to generate 
 * a vector for the keyword and the Pinecone API to find the most similar categories 
 * in the database.
 *
 * @param {string} keyword - The keyword to find similar categories for.
 * @param {Array} [categories] - The specific categories to return (optional). An array of category names.
 * @param {number} [numResults=1] - The number of results to return (optional). Default is 1.
 * @param {number} [showScores=0] - Whether to display the scores (optional). Default is 0 (don't display scores).
 * @param {number} [lastN] - Number of last parts of the category path to display (optional). If not provided, displays the full path.
 * @param {string} [separator=' -> '] - The separator used in the category path (optional). Default is ' -> '.
 * @return {Array} An array of the most similar categories and their scores (if showScores is 1).
 * @customfunction
 */
function VECTORDB(keyword, categories, numResults = 1, showScores = 0, lastN, separator = ' -> ') {
  // Define API endpoints
  const openAIEndpoint = "https://openai-services-wope-uk.openai.azure.com/openai/deployments/embed/embeddings?api-version=2023-05-15";
  const pineconeEndpoint = "https://category-vectors-a20b87e.svc.us-east1-gcp.pinecone.io/query";
  
  // Define headers for OpenAI and Pinecone requests
  const openAIHeaders = {
    'Content-Type': 'application/json',
    'api-key': OPENAI_API_KEY
  };
  const pineconeHeaders = {
    'Content-Type': 'application/json',
    'api-key': PINECONE_API_KEY
  };

  // Fetch vector from OpenAI
  const vector = getVectorFromOpenAI(openAIEndpoint, keyword, openAIHeaders);

  // Fetch matches from Pinecone
  const matches = getMatchesFromPinecone(pineconeEndpoint, vector, pineconeHeaders);

  // Prepare the results
  const results = prepareResults(matches, categories, numResults, showScores, lastN, separator);
  
  return results;
}

/**
 * Sends a request to the OpenAI API to generate a vector for the given keyword.
 */
function getVectorFromOpenAI(endpoint, keyword, headers) {
  const payload = JSON.stringify({"input": keyword});
  const response = UrlFetchApp.fetch(endpoint, { method: 'post', headers: headers, payload: payload });
  const vector = JSON.parse(response.getContentText()).data[0].embedding;
  return vector;
}

/**
 * Sends a request to the Pinecone API to find the most similar categories in the database.
 */
function getMatchesFromPinecone(endpoint, vector, headers) {
  const payload = JSON.stringify({
    "vector": vector,
    "namespace": "",
    "topK": 50,
    "includeMetadata": true,
    "includeValues": true,
    "filter": {"$and":[]}
  });
  const response = UrlFetchApp.fetch(endpoint, { method: 'post', headers: headers, payload: payload });
  const matches = JSON.parse(response.getContentText()).matches;
  return matches;
}

/**
 * Prepares the results to be returned by the custom function.
 */
function prepareResults(matches, categories, numResults, showScores, lastN, separator) {
  let results = [];
  for (let i = 0; i < numResults; i++) {
    const match = matches[i];
    const score = showScores == 1 ? " (" + (match.score * 100).toFixed(2) + "%)" : "";
    const metadata = match.metadata;

    if (categories) {
      categories.forEach(category => {
        if (category in metadata) {
          let categoryParts = metadata[category].split(separator);
          let categoryDisplay = lastN ? categoryParts.slice(-lastN).join(separator) : metadata[category];
          results[i] = [categoryDisplay + score];
        }
      });
    } else {
      results[i] = [
        formatCategory(metadata.googleCat, score, lastN, separator),
        formatCategory(metadata.openaiCat, score, lastN, separator),
        formatCategory(metadata.wopeCat, score, lastN, separator)
      ];
    }
  }
  return results;
}

/**
 * Formats the category string based on the score and the lastN parameter.
 */
function formatCategory(category, score, lastN, separator) {
  let categoryParts = category.split(separator);
  let categoryDisplay = lastN ? categoryParts.slice(-lastN).join(separator) : category;
  return categoryDisplay + score;
}
