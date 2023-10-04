# Google Sheets VectorDB Integration

## Description

This Google Sheets custom function enables you to fetch categories similar to a given keyword from a vector database. It employs the OpenAI API to generate a vector for the keyword and the Pinecone API to locate the most similar categories in the database.

As the AI department at Wope, we needed something like this to test the embeddings we've created 👇

![CleanShot 2023-10-04 at 17 27 17@2x](https://github.com/yigitkonur/pineconedb-appscript-integration-for-sheets/assets/9989650/29814a8d-0a62-4edc-970b-944ee1cc7fc3)

## Prerequisites

To use this function, you will need:

- A Google account to access Google Sheets.
- An OpenAI account to generate vectors for the keywords.
- A Pinecone account to find similar categories in the vector database.
- API keys for both OpenAI and Pinecone.

## Configuration

1. Open your Google Sheets document.
2. Click on `Extensions > Apps Script`.
3. Delete any code in the script editor and replace it with the code from the `VectorDB.gs` file in this repository.
4. Replace `'Your-OpenAI-API-Key'` and `'Your-Pinecone-API-Key'` with your actual OpenAI and Pinecone API keys.
5. Click on `File > Save`. You can name the project as you like, for example, "VectorDB Integration".
6. Close the Apps Script Editor.

## Usage

You can use the `VECTORDB` function just like any other function in Google Sheets.

Here are the parameters you can use:

- `keyword` (required): The keyword to find similar categories for. This will be a cell reference or a text string.
- `categories` (optional): An array of specific categories to return. Can include any categories present in your metadata. If not provided, the function will return all categories.
- `numResults` (optional): The number of results to return. Default is 1.
- `showScores` (optional): Whether to display the scores. Default is 0 (don't display scores). Set to 1 to display scores.
- `lastN` (optional): The number of last parts of the category path to display. If not provided, displays the full path. For example, if the category path is "Level1 -> Level2 -> Level3", setting `lastN` to 1 will display "Level3", setting `lastN` to 2 will display "Level2 -> Level3".
- `separator` (optional): The separator used in the category path. Default is ' -> '.

Here are some examples of how to use the function:

![CleanShot 2023-10-04 at 17 28 48@2x](https://github.com/yigitkonur/pineconedb-appscript-integration-for-sheets/assets/9989650/9d0ff58f-24c6-4abf-a4c6-5dc56415ca81)


- `=VECTORDB(A2)`: Returns one result with all categories, without scores. Here, `A2` is the cell reference that contains the keyword.
- `=VECTORDB("keyword")`: Returns one result with all categories, without scores. Here, `"keyword"` is the keyword string.
- `=VECTORDB(A2, {"Category1"})`: Returns one result with only `Category1`, without scores.
- `=VECTORDB(A2, {"Category1", "Category2"}, 3)`: Returns three results with `Category1` and `Category2`, without scores.
- `=VECTORDB(A2, {"Category1"}, 1, 1)`: Returns one result with `Category1`, with scores.
- `=VECTORDB(A2, {"Category1"}, 3, 1, 2)`: Returns three results with `Category1`, with scores, displaying the last two parts of the category path.

When the function returns multiple results, each result will be in a separate row by default. If you want each result in a separate column instead, you can use the `TRANSPOSE()` function:

- `=TRANSPOSE(VECTORDB(A2))`: Returns one result with all categories, without scores, in a separate column.
- `=TRANSPOSE(VECTORDB(A2, {"Category1", "Category2"}, 3))`: Returns three results with `Category1` and `Category2`, without scores, each in a separate column.

![CleanShot 2023-10-04 at 17 15 20](https://github.com/yigitkonur/pineconedb-appscript-integration-for-sheets/assets/9989650/69094370-3b22-45f1-b89a-0e80f124967d)


## Support

If you encounter any issues or have any questions about this function, please open an issue in this GitHub repository.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
