import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import { WixServicesProvider, rootRouteLoader } from '@/wix-verticals/react-pages/react-router/routes/root';
import { ProductDetailsRoute, productRouteLoader } from '@/wix-verticals/react-pages/react-router/routes/product-details';
import { StoreCollectionRoute, storeCollectionRouteLoader } from '@/wix-verticals/react-pages/react-router/routes/store-collection';
import { defaultStoreCollectionRouteRedirectLoader } from '@/wix-verticals/react-pages/react-router/routes/store-redirect';
import { Cart } from '@/wix-verticals/react-pages/react-router/routes/cart';
import { MemberProtectedRoute } from '@/components/ui/member-protected-route';
import Layout from '@/components/Layout';
import HomePage from '@/components/pages/HomePage';
import ProfilePage from '@/components/pages/ProfilePage';
import AdminPage from '@/components/pages/AdminPage';

// Main layout wrapper with WixServicesProvider
function MainLayout() {
  return (
    <WixServicesProvider>
      <ScrollToTop />
      <Layout />
    </WixServicesProvider>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    loader: rootRouteLoader,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "store",
        element: (
          <div className="bg-primary py-12">
            <div className="max-w-[120rem] mx-auto px-6">
              <h1 className="font-heading text-5xl md:text-6xl italic text-primary-foreground mb-8">
                Our Collection
              </h1>
              <StoreCollectionRoute productPageRoute="/products" />
            </div>
          </div>
        ),
        loader: defaultStoreCollectionRouteRedirectLoader,
      },
      {
        path: "store/:categorySlug",
        element: (
          <div className="bg-primary py-12">
            <div className="max-w-[120rem] mx-auto px-6">
              <h1 className="font-heading text-5xl md:text-6xl italic text-primary-foreground mb-8">
                Our Collection
              </h1>
              <StoreCollectionRoute productPageRoute="/products" />
            </div>
          </div>
        ),
        loader: storeCollectionRouteLoader,
      },
      {
        path: "products/:slug",
        element: (
          <div className="bg-primary py-12">
            <div className="max-w-[120rem] mx-auto px-6">
              <ProductDetailsRoute />
            </div>
          </div>
        ),
        loader: productRouteLoader,
      },
      {
        path: "cart",
        element: (
          <div className="bg-primary py-12">
            <div className="max-w-[120rem] mx-auto px-6">
              <h1 className="font-heading text-5xl md:text-6xl italic text-primary-foreground mb-8">
                Shopping Cart
              </h1>
              <Cart />
            </div>
          </div>
        ),
      },
      {
        path: "profile",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to view your profile">
            <ProfilePage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <MemberProtectedRoute messageToSignIn="Sign in to access admin panel">
            <AdminPage />
          </MemberProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
