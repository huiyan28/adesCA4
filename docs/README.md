# CA3 - Website

> This document may be outdated, do refer to the one accessible on www.ades-fsp.github.io/ades-2021s2-website-solution

## Github Classroom Links

-   [2B01](https://classroom.github.com/g/YZAadN3J)
-   [2B02](https://classroom.github.com/g/MF_Y_e-G)
-   [2B03](https://classroom.github.com/g/v-RY2Nqc)
-   [2B04](https://classroom.github.com/g/WvJfDGl_)

## Requirements

Refer to [Website Wireframe](https://ades-fsp.github.io/website-wireframe) for full requirement listing. You may also want to [watch these videos](https://web.microsoftstream.com/channel/3fe91ee4-a32d-4c6d-8cbf-4fa8c57d257a) to see what is expected.

## Setting up Lecturer's Backend

1. Download the backend solution from one of the link into the `./bin` directory:
    1. [Windows x64](https://github.com/ADES-FSP/ades-fsp.github.io/releases/download/v2.0/www-win.exe)
    2. [MacOS x64](https://github.com/ADES-FSP/ades-fsp.github.io/releases/download/v2.0/www-macos)
    3. [Linux x64](https://github.com/ADES-FSP/ades-fsp.github.io/releases/download/v2.0/www-linux)
2. Set the database connection string in `.env` file
3. To start the backend

    1. Set the correct environment value (Use `#` to comment out unused lines)
    2. Run the executable e.g.

        ```
        .\bin\www-win.exe
        ```

    3. You should see that the Queue System is listening at the correct port number
