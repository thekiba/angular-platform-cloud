import { ResourceLoader } from '@angular/compiler';
import {
  COMPILER_OPTIONS,
  createPlatformFactory,
  Injectable,
  ModuleWithComponentFactories,
  PlatformRef,
  StaticProvider
} from '@angular/core';
import {
  JitCompilerFactory as _JitCompilerFactory,
  ɵplatformCoreDynamic as platformCoreDynamic,
  ɵResourceLoaderImpl as ResourceLoaderBrowserImpl
} from '@angular/platform-browser-dynamic';
import {
  PLATFORM_CLOUD_BROWSER_PROVIDERS,
  PLATFORM_CLOUD_SERVER_PROVIDERS,
  PLATFORM_CLOUD_SHARED_PROVIDERS
} from '@angular/platform-cloud';

declare var require: any;

@Injectable()
export class ResourceLoaderServerImpl extends ResourceLoader {
  // Hacking for angular browser
  fs = require('fs');
  path = require('path');

  constructor() {
    super();
  }

  get(url: string): Promise<string> {
    return new Promise((res) => {
      const path = this.path.resolve(this.path.join('projects', 'server', 'src', 'app', url));
      this.fs.readFile(path, (err, data) => res(data.toString('utf-8')));
    });
  }
}

export const platformCloudServerDynamic =
  createPlatformFactory(platformCoreDynamic, 'cloudServerDynamic', [
    {
      provide: COMPILER_OPTIONS,
      useValue: {providers: [{provide: ResourceLoader, useClass: ResourceLoaderServerImpl, deps: []}]},
      multi: true
    },
    PLATFORM_CLOUD_SHARED_PROVIDERS,
    PLATFORM_CLOUD_SERVER_PROVIDERS
  ]);

export const platformCloudBrowserDynamic =
  createPlatformFactory(platformCoreDynamic, 'cloudBrowserDynamic', [
    {
      provide: COMPILER_OPTIONS,
      useValue: {providers: [{provide: ResourceLoader, useClass: ResourceLoaderBrowserImpl, deps: []}]},
      multi: true
    },
    PLATFORM_CLOUD_SHARED_PROVIDERS,
    PLATFORM_CLOUD_BROWSER_PROVIDERS
  ]);

export function bootstrapCloudServerDynamic(customProviders: StaticProvider[] = []): Promise<PlatformRef> {
  const platform = platformCloudServerDynamic(customProviders);
  return Promise.resolve(platform);
}

export function bootstrapCloudBrowserDynamic(customProviders: StaticProvider[] = []): Promise<PlatformRef> {
  const platform = platformCloudBrowserDynamic(customProviders);
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
