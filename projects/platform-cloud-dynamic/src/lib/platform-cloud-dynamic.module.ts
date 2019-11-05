import { ResourceLoader } from '@angular/compiler';
import { COMPILER_OPTIONS, createPlatformFactory, PlatformRef, StaticProvider } from '@angular/core';
import { ɵplatformCoreDynamic as platformCoreDynamic } from '@angular/platform-browser-dynamic';
import { PLATFORM_CLOUD_SHARED_PROVIDERS, PLATFORM_CLOUD_SERVER_PROVIDERS } from '@angular/platform-cloud';
import { Injectable } from '@angular/core';

import { readFile } from 'fs';
import { join, resolve } from 'path';

@Injectable()
export class ResourceLoaderImpl extends ResourceLoader {
  get(url: string): Promise<string> {
    return new Promise((res) => {
      const path = resolve(join('projects', 'server', 'src', 'app', url));
      console.log('Loading', url, resolve(join('projects', 'server', 'src', 'app', url)));
      readFile(path, (err, data) => res(data.toString('utf-8')));
    });
  }
}

export const platformCloudServerDynamic =
  createPlatformFactory(platformCoreDynamic, 'cloudServerDynamic', [
    {
      provide: COMPILER_OPTIONS,
      useValue: {providers: [{provide: ResourceLoader, useClass: ResourceLoaderImpl, deps: []}]},
      multi: true
    },
    PLATFORM_CLOUD_SHARED_PROVIDERS,
    PLATFORM_CLOUD_SERVER_PROVIDERS
  ]);

export function bootstrapCloudServerDynamic(customProviders: StaticProvider[] = []): Promise<PlatformRef> {
  const platform = platformCloudServerDynamic(customProviders);
  return Promise.resolve(platform);
}
