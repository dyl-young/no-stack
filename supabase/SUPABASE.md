# Supabase

## What is Supabase?

Supabase is an open-source backend-as-a-service that enables developers to build secure and scalable applications with ease. It provides a suite of tools, including a real-time database (based on PostgreSQL), authentication, file storage, and auto-generated APIs, which can be seamlessly integrated into web and mobile applications. Supabase is often considered a Firebase alternative that leverages SQL databases and offers robust backend features.

## How Supabase Works

Supabase simplifies backend development by providing:

1. **Database**: A fully-managed PostgreSQL database with real-time capabilities, row-level security, and instant APIs generated for each table.
2. **Authentication**: A secure, customizable, and easy-to-use authentication system that supports various sign-in methods, including email, phone, social logins, and third-party OAuth providers.
3. **Storage**: Scalable storage for managing and serving large files, such as images and videos, with fine-grained access control.

4. **API**: Auto-generated RESTful APIs and GraphQL support for interacting with the database in a structured and scalable way.

5. **Edge Functions**: Serverless functions that run close to the user, allowing for low-latency and highly scalable backend operations.

Supabase integrates these components into a single platform, reducing the overhead of managing backend infrastructure and allowing developers to focus on building features.

## How to Run Supabase Locally

To run Supabase locally, follow these steps:

1. **Install Supabase CLI**: First, you need to install the Supabase CLI, which allows you to manage and develop your Supabase projects locally. You can install it by following the instructions in the [Supabase CLI Local Development Guide](https://supabase.com/docs/guides/cli/local-development).

2. **Initialize a Project**: Navigate to your project directory and run the following command to initialize Supabase:

   ```bash
   supabase init
   ```

3. **Start Supabase**: To start Supabase locally, use the command:

   ```bash
   supabase start
   ```

This command will spin up the Supabase services, including the PostgreSQL database, the authentication service, and the storage service, using Docker. Ensure that Docker is running on your machine.

Once all of the Supabase services are running, you'll see output containing your local Supabase credentials. It should look like this, with urls and keys that you'll use in your local project:

```bash

Started supabase local development setup.

         API URL: http://localhost:54321
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
        anon key: eyJh......
service_role key: eyJh......
```

You can navigate to the studio at http://localhost:54323 to view your database tables and manage your data.

4. **Connect Your Application**: Use the connection details provided by the Supabase CLI (typically found in the `.env` file) to connect your Next.js and Expo apps to the local Supabase instance.

5. **Stopping Supabase**: To stop the local Supabase services, run:

   ```bash
   supabase stop
   ```

For more detailed instructions, visit the official [Supabase CLI Local Development Guide](https://supabase.com/docs/guides/cli/local-development).

## Troubleshooting

Here are some common issues and solutions when working with Supabase locally:

- **Docker Issues**: If Supabase services fail to start, ensure that Docker is installed and running correctly. Restarting Docker or your computer might resolve connectivity issues.
- **Port Conflicts**: Supabase uses specific ports to run services locally. If you encounter port conflicts, check for other running services that may be using the same ports and stop them or change the ports in Supabase's configuration.

- **Database Connection Issues**: Verify that your application’s connection settings match the credentials provided by Supabase. Check the `.env` file for accuracy, and ensure that the local Supabase instance is running.

- **Permission Errors**: If you experience permission errors when accessing the database or storage, ensure that your API keys and JWT secrets are correctly configured and that your policies in Supabase allow the necessary operations.

- **Conflict with another project**: If you have another project running on the same ports, try manually stopping the conflicting project with:

```bash
supabase stop --no-backup
```

- **Logs and Debugging**: Use the Supabase CLI logs to debug issues:

```bash
 supabase logs
```

This command will display logs for all running services, helping you identify errors or misconfigurations.

For further assistance, refer to the [Supabase documentation](https://supabase.com/docs)

<!-- Update this with the new scripts added -->
