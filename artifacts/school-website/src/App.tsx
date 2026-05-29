import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import NotFound from "@/pages/not-found";

// Public pages
import Home from "@/pages/Home";
import AboutPage from "@/pages/About";
import { MissionPage, HistoryPage, CurriculumPage, TimetablePage } from "@/pages/SimplePage";
import StaffPage from "@/pages/Staff";
import { NurseryPage, PrimaryPage } from "@/pages/Academics";
import ClassDetailPage from "@/pages/ClassDetail";
import NewsPage from "@/pages/News";
import NewsDetail from "@/pages/NewsDetail";
import EventsPage from "@/pages/Events";
import EventDetail from "@/pages/EventDetail";
import GalleryPage from "@/pages/Gallery";
import GalleryAlbumPage from "@/pages/GalleryAlbum";
import AdmissionsPage from "@/pages/Admissions";
import ResourcesPage from "@/pages/Resources";
import ContactPage from "@/pages/Contact";

// Admin pages
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminSlides from "@/pages/admin/AdminSlides";
import AdminNews from "@/pages/admin/AdminNews";
import AdminEvents from "@/pages/admin/AdminEvents";
import AdminGallery from "@/pages/admin/AdminGallery";
import AdminStaff from "@/pages/admin/AdminStaff";
import AdminClasses from "@/pages/admin/AdminClasses";
import AdminDownloads from "@/pages/admin/AdminDownloads";
import AdminMessages from "@/pages/admin/AdminMessages";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminActivity from "@/pages/admin/AdminActivity";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1,
    },
  },
});

function Router() {
  return (
    <Switch>
      {/* Public */}
      <Route path="/" component={Home} />
      <Route path="/about" component={AboutPage} />
      <Route path="/about/mission" component={MissionPage} />
      <Route path="/about/history" component={HistoryPage} />
      <Route path="/about/staff" component={StaffPage} />
      <Route path="/academics/nursery" component={NurseryPage} />
      <Route path="/academics/primary" component={PrimaryPage} />
      <Route path="/academics/curriculum" component={CurriculumPage} />
      <Route path="/academics/timetable" component={TimetablePage} />
      <Route path="/academics/classes/:id" component={ClassDetailPage} />
      <Route path="/news" component={NewsPage} />
      <Route path="/news/:slug" component={NewsDetail} />
      <Route path="/events" component={EventsPage} />
      <Route path="/events/:id" component={EventDetail} />
      <Route path="/gallery" component={GalleryPage} />
      <Route path="/gallery/:id" component={GalleryAlbumPage} />
      <Route path="/admissions" component={AdmissionsPage} />
      <Route path="/resources" component={ResourcesPage} />
      <Route path="/contact" component={ContactPage} />

      {/* Admin */}
      <Route path="/admin">
        {() => <Redirect to="/admin/login" />}
      </Route>
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/slides" component={AdminSlides} />
      <Route path="/admin/news" component={AdminNews} />
      <Route path="/admin/events" component={AdminEvents} />
      <Route path="/admin/gallery" component={AdminGallery} />
      <Route path="/admin/staff" component={AdminStaff} />
      <Route path="/admin/classes" component={AdminClasses} />
      <Route path="/admin/downloads" component={AdminDownloads} />
      <Route path="/admin/messages" component={AdminMessages} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin/activity" component={AdminActivity} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AdminAuthProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </AdminAuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
