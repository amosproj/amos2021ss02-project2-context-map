import { injectable } from 'inversify';
import 'reflect-metadata';
import { LimitQuery } from '../entities/queries/LimitQuery';
import { QueryResult } from '../entities/queries/QueryResult';
import CancellationError from '../utils/CancellationError';
import { CancellationToken } from '../utils/CancellationToken';
import nop from '../utils/nop';
import QueryService from './QueryService';

@injectable()
export class QueryServiceImpl extends QueryService {
  private readonly baseUri = 'localhost:8080'; // TODO: Make me configurable

  public queryAll(query?: LimitQuery, cancellation?: CancellationToken): Promise<QueryResult> {
    const url = `${this.baseUri}/queryAll`;
    
    return new Promise<QueryResult>(function(resolve, reject) {
      if(cancellation?.isCancellationRequested) {
        reject(new CancellationError());
      }

      var request = new XMLHttpRequest();
      request.open('post', url, true);
      request.setRequestHeader('Content-Type', 'application/json');

      let cancellationUnsubscribe = nop;

      if(cancellation) {
        cancellationUnsubscribe = cancellation.subscribe(() => request.abort());
      }

      request.onload = function() {
        cancellationUnsubscribe();
        if (request.status == 200) {
          resolve(JSON.parse(request.response)); // TODO: Validate the response?
        } else {
          reject(Error(request.statusText));
        }
      }

      request.onerror = function() {
        cancellationUnsubscribe();
        if(cancellation?.isCancellationRequested) {
          reject(new CancellationError());
        } else {
          reject(Error());
        }   
      }

      request.onabort = function() {
        cancellationUnsubscribe();
        reject(new CancellationError());
      }

      request.send(JSON.stringify(query ?? {}));
    });
  }
}