// *****************************************************************************
// Copyright (C) 2020 TypeFox and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
// *****************************************************************************

import { ContainerModule } from '@theia/core/shared/inversify';
import { ElectronMainApplicationContribution } from '@theia/core/lib/electron-main/electron-main-application';
import { SampleUpdaterPath, SampleUpdater } from '../../common/updater/sample-updater';
import { SampleUpdaterImpl } from './sample-updater-impl';
import { ServiceContribution } from '@theia/core/lib/common';
import { ElectronMainAndFrontend } from '@theia/core/lib/electron-common';

export const SampleUpdaterElectronMainAndFrontendContainerModule = new ContainerModule(bind => {
    bind(ServiceContribution)
        .toDynamicValue(ctx => ServiceContribution.fromEntries(
            // This will return the same singleton instance from the main container module
            // for `SampleUpdater`, but this is by design here.
            [SampleUpdaterPath, () => ctx.container.get(SampleUpdater)]
        ))
        .inSingletonScope()
        .whenTargetNamed(ElectronMainAndFrontend);
});

export default new ContainerModule(bind => {
    bind(SampleUpdater).to(SampleUpdaterImpl).inSingletonScope();
    bind(ElectronMainApplicationContribution).toService(SampleUpdater);
    bind(ContainerModule)
        .toConstantValue(SampleUpdaterElectronMainAndFrontendContainerModule)
        .whenTargetNamed(ElectronMainAndFrontend);
});
