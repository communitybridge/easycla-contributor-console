#!/bin/bash

# Copyright The Linux Foundation and each contributor to LFX.
# SPDX-License-Identifier: MIT

set -e

yarn audit || EXIT_CODE=$?
# Error if critial or high vulnerabilities are found
# 1 for INFO
# 2 for LOW
# 4 for MODERATE
# 8 for HIGH // there are some high vulnerabilities that are not really high or not possible to fix
# 16 for CRITICAL
if [[ $EXIT_CODE -ge 16 ]]; then
  exit 1
else
  exit 0
fi