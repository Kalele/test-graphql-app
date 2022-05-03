import {Component, OnInit} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {gql} from 'graphql-tag';
import {Person, Query} from "../types";
import {map, Observable, of} from "rxjs";

@Component({
  selector: 'app-person-detail',
  templateUrl: './person-detail.component.html',
  styleUrls: ['./person-detail.component.css']
})
export class PersonDetailComponent implements OnInit {
  persons!: Observable<Person[]>;
  pageNumber: number = 0;

  constructor(private apollo: Apollo) {
  }

  ngOnInit(): void {
    this.getPersonByPage(++this.pageNumber);
  }

  getSwap(): void {
    this.pageNumber = 0;
    this.persons =
      this.apollo.watchQuery<Query>({
        query: gql`
          query allPersons {
            getSwap{
              results{
                name
                height
                mass
                gender
                homeworld
              }
            }
          }
        `
      })
      .valueChanges
      .pipe(
        map(results => results.data.getSwap.results)
      );
  }

  getPerson(): void {
    this.pageNumber = 0;
    this.persons = of([]);
    this.apollo.watchQuery<Query>({
      query: gql`
        query allPersons {
          getPerson{
            name
            height
            mass
            gender
            homeworld
          }
        }
      `
    })
    .valueChanges
    .subscribe((result: any) => {
        this.persons = of([result?.data?.getPerson]);
      }
    );
  }

  getPersonByPage(page: number) {
    this.apollo.watchQuery<Query>({
      query: gql`
        query allPersons {
          getPersonByPage(page: ${page}){
            results{
              name
              height
              mass
              gender
              homeworld
            }
          }
        }
      `,
      variables: {
        page: page
      }
    })
    .valueChanges
    .subscribe((result: any) => {
        this.persons = of(result?.data?.getPersonByPage?.results);
      }
    );
  }

  getPersonByName(name: string): void {
    this.apollo.watchQuery<Query>({
      query: gql`
        query allPersons {
          getPersonByName(name: \"${name}\"){
            results{
              name
              height
              mass
              gender
              homeworld
            }
          }
        }
      `,
      variables: {
        name: name
      }
    })
    .valueChanges
    .subscribe((result: any) => {
        this.persons = of(result?.data?.getPersonByName?.results);
      }
    );
  }

  isNumeric = (num: any) => (typeof (num) === 'number' || typeof (num) === "string" && num.trim() !== '') && !isNaN(num as number);

  searchPerson(searchParam: string): void {
    if (this.isNumeric(searchParam)) {
      this.pageNumber = parseInt(searchParam);
      this.getPersonByPage(parseInt(searchParam));
    } else {
      this.pageNumber = 0;
      this.getPersonByName(searchParam);
    }
  }

  nextPageClick(): void {
    this.getPersonByPage(++this.pageNumber);
  }

  prevPageClick(): void {
    this.getPersonByPage(--this.pageNumber);
  }
}
