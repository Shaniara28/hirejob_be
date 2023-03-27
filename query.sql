CREATE DATABASE hirejob;

\c hirejob;

-- create type portfolio_type as enum(
--     'Mobile', 
--     'Web'
-- );

create table recruiters(
    id_recruiter varchar(255) not null primary key,
    fullname varchar(255) not null,
    email varchar(255) not null unique,
    password varchar(255) not null,
    company_name varchar(255) not null,
    position varchar(255) not null,
    phone varchar(255) not null,
    job_field varchar(255) not null,
    city varchar (255) not null,
    description_company varchar(255),
    instagram varchar(255),
    linkedin varchar(255),
    role varchar(255)
);

create table workers (
    id_worker varchar(255) primary key,
    name varchar(255) not null,
    email varchar(255) not null,
    phone varchar(255) not null,
    password varchar(255) not null,
    jobdesk varchar(255),
    description varchar(255),
    address varchar(255),
    workplace varchar(255),
    role varchar(255)
)

create table skills (
    id_skill varchar(255) primary key,
    name varchar(255) not null,
    id_worker varchar(255),
    CONSTRAINT fk_worker FOREIGN KEY (id_worker) REFERENCES workers(id_worker)
)

create table portfolio (
    id_portfolio varchar(255) primary key,
    name varchar(255) not null,
    repository varchar(255),
    type varchar(255),
    id_worker varchar(255),
    CONSTRAINT fk_worker FOREIGN KEY (id_worker) REFERENCES workers(id_worker)
)

create table experiences(
    id_experience varchar not null primary key,
    job_desk varchar(40) not null,
    company_name varchar(40) not null,
    date_start varchar not null,
    date_end varchar not null,
    description text not null,
    id_worker varchar(255),
    CONSTRAINT fk_worker FOREIGN KEY (id_worker) REFERENCES workers(id_worker)
);

INSERT INTO recruiters(id_recruiter,fullname,email,password,company_name,position,phone,job_field,city,description_company, instagram,linkedin) VALUES('1','Kim Taehyung','Taehyung@gmail.com','taehyung123','Hybe Entertaiment','HRD','08543216789','Musisi','Surabaya, Jawa Timur','bla bla bla','@Taehyung_BTS','https://www.linkedin.com/in/taehyung');

select workers.*, skills.*, portfolios.*, experiences from workers inner join skills on workers.id_worker = skills.id_worker inner join portfolios on workers.id_worker = portfolios.id_worker inner join experiences on workers.id_worker = experiences.id_worker;

select workers.id_worker, workers.name, workers.email, workers.phone, workers.jobdesk, workers.description, workers.address, workers.workplace , skills.name_skill , portfolios.name_portfolio, portfolios.repo_link, portfolios.type_portfolio , experiences.company_name, experiences.jobdesk, experiences.date_start, experiences.date_end, experiences.description experiences_ from workers left join skills on workers.id_worker = skills.id_worker left join portfolios on workers.id_worker = portfolios.id_worker left join experiences on workers.id_worker=experiences.id_worker where workers.id_worker='fd8386bd-52b6-4320-bdb0-126d313eb055'