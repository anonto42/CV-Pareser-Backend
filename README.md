# CV Parser Backend

This project is a backend service for parsing CVs and processing data extracted from them. It supports uploading CVs in PDF and CSV formats, processes the data, and prepares it for further use.

## Features
- Upload CVs in PDF or CSV format.
- Parse and extract data from uploaded files.
- Process extracted data for further use.

## API Endpoints

### 1. Upload PDF
**Endpoint:** `POST /cv-ingestion/upload-pdf`
- **Description:** Upload a PDF file to extract and process CV data.
- **Request:**
  - `cv`: PDF file to upload.
- **Response:**
  - `success`: Boolean indicating success.
  - `message`: Status message.

### 2. Upload CSV
**Endpoint:** `POST /cv-ingestion/upload-csv`
- **Description:** Upload a CSV file containing CV data to process.
- **Request:**
  - `csv`: CSV file to upload.
- **Response:**
  - `success`: Boolean indicating success.
  - `message`: Status message.

## How It Works
1. **File Upload:**
   - Users upload a file (PDF or CSV) via the respective API endpoint.
2. **Parsing:**
   - PDF files are parsed using `pdf-parse`.
   - CSV files are parsed using `csv-parser`.
3. **Processing:**
   - Extracted data is sent to the `DataForProcessUseCase` for further processing.

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   yarn dev
   ```

## Folder Structure
- `src/`
  - `modules/`
    - `cv-ingestion/`: Handles CV ingestion (PDF/CSV upload, parsing, and processing).
    - `cv-process/`: Processes extracted CV data.
    - `shared/`: Shared utilities, types, and configurations.

## Dependencies
- `express`: Web framework.
- `pdf-parse`: For parsing PDF files.
- `csv-parser`: For parsing CSV files.
- `zod`: For request validation.

## Contribution
Feel free to fork this repository and submit pull requests for improvements or bug fixes.
