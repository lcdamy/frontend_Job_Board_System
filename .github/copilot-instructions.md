# Copilot Instructions for AI Agents

## Project Overview
- This is a Next.js frontend for a Job Board System, using TypeScript, shadcn/ui, SWR, and NextAuth for authentication.
- The codebase is organized by feature: `src/app` (routing, pages, API), `src/components` (UI, tables, sidebar, forms), `src/hooks` (API/data fetching), and `src/lib` (utils, types, constants).

## Key Patterns & Conventions
- **API Data Fetching:** All backend calls are made via custom hooks in `src/hooks/` (e.g., `useGetUsers`, `useGetAudits`, `useGetPublicJobs`). These use SWR for caching and revalidation. Always pass pagination params if supported.
- **Pagination:** Table components expect paginated data and total counts. Pass only the data array (e.g., `users.data`) to tables, not the full API response object.
- **Authentication:** Uses NextAuth. Access tokens are attached to API requests in hooks using `useSession`.
- **UI Components:** Uses shadcn/ui for all UI primitives. Custom components (e.g., `AppSidebar`, `DashboardHeader`) are in `src/components/`.
- **Breadcrumbs:** Dynamic breadcrumbs are generated in layout files using route and param info. See `src/app/(dashboard)/layout.tsx` for the pattern.
- **Table Actions:** Table columns are defined in `src/components/table/columns.tsx`. Actions (edit, delete, view) are handled via cell renderers.
- **State Management:** Minimal global state; local state and SWR are preferred. Zustand is available in `src/store/` if needed.
- **Environment Variables:** All API URLs and secrets are managed via `.env` files. Use `process.env.NEXT_PUBLIC_API_URL` in hooks.

## Developer Workflows
- **Development:**
  - Start with `npm run dev`.
  - Copy `.env.example` to `.env` and set variables.
- **Build:**
  - Run `npm run build` for production.
- **UI Additions:**
  - Use `npx shadcn@latest add <component>` to scaffold new UI primitives.
- **Data Refresh:**
  - Use SWR's `mutate` to refresh lists after mutations (e.g., after submitting a job).

## Integration Points
- **Backend:** All data comes from a REST API, with endpoints and pagination documented in hooks.
- **Auth:** All protected endpoints require a Bearer token from NextAuth session.
- **External UI:** shadcn/ui is the standard for all new UI work.

## Examples
- See `src/hooks/useGetUsers.tsx` for paginated API call pattern.
- See `src/components/table/data-table.tsx` for table pagination and integration.
- See `src/app/(dashboard)/layout.tsx` for dynamic breadcrumb logic.

## Project-Specific Advice
- Always destructure and pass only the data array to tables: `data={users.data ?? []}`.
- When adding new API calls, follow the SWR + custom hook pattern in `src/hooks/`.
- For new UI, prefer shadcn/ui and keep components in `src/components/`.

---

If you are unsure about a pattern, check the referenced files or ask for clarification.
