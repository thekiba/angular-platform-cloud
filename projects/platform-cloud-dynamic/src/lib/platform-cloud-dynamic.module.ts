import { ResourceLoader } from '@angular/compiler';
import {
  COMPILER_OPTIONS,
  createPlatformFactory,
  Injectable,
  ModuleWithComponentFactories,
  PlatformRef,
  StaticProvider
} from '@angular/core';
import { JitCompilerFactory as _JitCompilerFactory, ɵplatformCoreDynamic as platformCoreDynamic } from '@angular/platform-browser-dynamic';
import { PLATFORM_CLOUD_SERVER_PROVIDERS, PLATFORM_CLOUD_SHARED_PROVIDERS } from '@angular/platform-cloud';

import { readFile } from 'fs';
import { join, resolve } from 'path';

@Injectable()
export class ResourceLoaderImpl extends ResourceLoader {
  get(url: string): Promise<string> {
    return new Promise((res) => {
      const path = resolve(join('projects', 'server', 'src', 'app', url));
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

/**
 * Early hack to speed up JIT restart below.
 */
export function compileModuleAndAllComponentsAsync<T>(
  platformRef: PlatformRef, module: any): Promise<ModuleWithComponentFactories<T>> {
  const config = platformRef.injector.get(COMPILER_OPTIONS);

  const JitCompilerFactory: any = _JitCompilerFactory;
  const compilerFactory = new JitCompilerFactory([]);
  const compiler = compilerFactory.createCompiler(config);
  return compiler.compileModuleAndAllComponentsAsync(module);
}
