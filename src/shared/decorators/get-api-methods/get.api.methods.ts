import { Delete, Get, Patch, Post, Put } from '@nestjs/common';
import { Api } from 'src/shared/enums/API';

export class ApiMethods {
  constructor(private url: string) {}
  map = new Map<Api, MethodDecorator>([
    [Api.GET, Get(this.url)],
    [Api.POST, Post(this.url)],
    [Api.PATCH, Patch(this.url)],
    [Api.PUT, Put(this.url)],
    [Api.DELETE, Delete(this.url)],
  ]);
  get(method: Api): MethodDecorator {
    return this.map.get(method);
  }
}
