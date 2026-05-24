
export default function App() {
  return (
    <div style={{padding: "40px"}}>
      <h1>Aalasi Blog Working ✅</h1>
    </div>
  )
}






// import { useEffect } from 'react';
/*import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { BlogDetails } from './pages/BlogDetails';
import { Dashboard } from './pages/Dashboard';
import { BlogListPage } from './pages/BlogListPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryPage } from './pages/CategoryPage';
import { SearchPage } from './pages/SearchPage';
import { AuthPage } from './pages/AuthPage';
import { AboutPage, ContactPage } from './pages/StaticPages';
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
 // useEffect(() => {
   // fetch('/api/track-view', { method: 'POST' });
  }, []);

  return (
    <Routes>
      {/* Public area with MainLayout */}
  /*    <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="latest" element={<BlogListPage type="latest" />} />
        <Route path="trending" element={<BlogListPage type="trending" />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="category/:slug" element={<CategoryPage />} />
        <Route path="search" element={<SearchPage />} />
        
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        
        <Route path="blog/:slug" element={<BlogDetails />} />
      </Route>

      {/* Admin Panel Hidden Route */}
 /*     <Route path="/aalsi-admin-login" element={<AuthPage />} />

      {/* Protected Admin Routes */}
/*      <Route path="/admin" element={<ProtectedRoute />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path=":tab" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
