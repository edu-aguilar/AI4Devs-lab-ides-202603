import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './ui/pages/Dashboard';
import { CandidateFormPage } from './ui/pages/CandidateFormPage';

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/candidates/new" element={<CandidateFormPage />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;