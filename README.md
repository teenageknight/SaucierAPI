# SaucierAPI

### Description

The SaucierAPI was senior design project at Georgia Tech with CreateX. We were tasked with creating a company from a problem we found, and we chose problems in cooking. One of the biggest problems we heard from recipe companies and publishers was that people dont cook recipes, they cook meals. However, meals are hard to time, they are complicated and vary extensivly based on skill level. Working with a team of 6 (Kunal Daga, Yen-Shuo Hsu, Suhel Keswani, Zain Lalani, and Anastasiya Masalava), we developed an API that set out to solve this and other problems like this. At the end of the semester we had produced a product that did this about 80% of the time very naivly, as well as a few other things as a proof of concept. I have set out in this repo to continue this as a side project, because the recipe problem space is very interesting.

## Structure

This repo is mainly in 2 folder...

1. `api/`: This folder contains the fast api code, as well as most of the python logic for the api.
2. `app/`: A react native app to help demo the api endpoints, and eventually to act as a landing page for SaucierAPI
3. `scripts/`: CI and CD scripts because my brain is dumb

## Getting Started with SaucierAPI

Currently, there is no production build of SaucierAPI. If you want to play around with this repo, follow the following steps...

### For SaucierAPI

1. Create a virtual machine using requirements.txt
2. Install Uvicorn using `pip install "uvicorn[standard]"`
3. `npm run start:api` from root

### For FrontEnd Demo

1. Install node modules inside `app/` folder with `npm i`
2. `npm run start` or `npm run start:app` from root directory

## Next Steps

I am currently working on porting the front end to typescript and adding some unit tests to help me develop quicker and with more people.
